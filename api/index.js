const express = require("express");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const Place = require("./models/Place");
const Booking = require("./models/Booking");
const Transaction = require("./models/Transaction");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const Razorpay = require('razorpay');

const app = express();
app.use(express.json());
app.use(cookieParser());
const photosMiddleware = multer({ dest: "uploads/" });

const whitelist = ["http://localhost:5173"]; // Add your localhost URL
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "this_is_jwt_secret";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// MongoDB Connection with logging
mongoose.connect(process.env.MONGO_URL || process.env.MONGODB_URL);

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully!');
  console.log(`📊 Database: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

function getUserDataFromReq(req) {
  return new Promise((resolve) => {
    const token = req.cookies && req.cookies.token;
    if (!token) return resolve(null);
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) {
        // invalid or expired token -> treat as unauthenticated
        return resolve(null);
      }
      resolve(userData);
    });
  });
}

app.get("/test", (req, res) => {
  res.json({
    test: "working fine",
  });
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(user);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password, "test");
  const user = await User.findOne({ email });
  if (!user) {
    res.status(422).json("Invalid user");
    return;
  }
  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    res.status(422).json("Invalid password");
    return;
  }
  try {
    // const token = await jwt.sign({ email: user.email, id: user._id }, jwtSecret);
    jwt.sign(
      { email: user.email, id: user._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) {
          throw err;
        }
        res.cookie("token", token).json(user);
      }
    );
  } catch (e) {
    res.json(401).json("cookie not set");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  try {
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
          throw err;
        }
        const { name, email, _id } = await User.findById(userData.id);
        res.json({ name, email, _id });
      });
    } else {
      res.json(err);
    }
  } catch (err) {
    res.json(err);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("true");
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  try {
    // Upload image from URL directly to Cloudinary
    const result = await cloudinary.uploader.upload(link, {
      folder: "airbnb-clone",
      resource_type: "image",
    });
    // Return the secure URL (full Cloudinary URL)
    res.json(result.secure_url);
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(422).json({ error: err.message });
  }
});

app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  try {
    const uploadedFiles = [];

    // Upload each file to Cloudinary
    for (let i = 0; i < req.files.length; i++) {
      const { path } = req.files[i];

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(path, {
        folder: "airbnb-clone",
        resource_type: "image",
      });

      // Store the secure URL (full Cloudinary URL)
      uploadedFiles.push(result.secure_url);

      // Clean up: delete the temporary local file
      fs.unlinkSync(path);
    }

    res.json(uploadedFiles);
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(422).json({ error: err.message });
  }
});

app.post("/places", async (req, res) => {
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  const { token } = req.cookies;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      throw err;
    }
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuest: maxGuests,
      price,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    try {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
          throw err;
        }
        const { id } = userData;
        const places = await Place.find({ owner: id });
        res.json(places);
      });
    } catch (e) {
      res.status(422).json(e);
    }
  }
});

app.get("/places/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const place = await Place.findById(id);
    if (!place) {
      res.status(404).json({ message: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      throw err;
    }

    const placeDoc = await Place.findById(id);
    if (!placeDoc) {
      res.status(500).json({ message: "Place not found" });
    }

    if (userData.id === placeDoc.owner.toJSON()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuest: maxGuests,
        price,
      });
    }
    await placeDoc.save();
    res.json("ok");
  });
});

app.get("/places", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong while getting places", err });
  }
});

app.post("/bookings", async (req, res) => {
  const { checkIn, checkOut, numberOfGuests, name, phone, place, price } =
    req.body;

  const userData = await getUserDataFromReq(req);
  if (!userData) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const booking = await Booking.create({
      place,
      checkIn,
      checkOut,
      name,
      phone,
      numberOfGuests,
      price,
      user: userData.id,
    });
    res.json(booking);
  } catch (err) {
    res.status(404).json(err);
  }
});

// Create Razorpay order and return order details for client-side checkout
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}`, notes = {} } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const options = {
      amount: Number(amount), // amount in paise (if INR) or smallest currency unit
      currency,
      receipt,
      payment_capture: 1,
      notes,
    };

    const order = await razorpay.orders.create(options);

    // Create a Transaction record (pending)
    let transaction = null;
    try {
      const userData = await getUserDataFromReq(req).catch(() => null);
      transaction = await Transaction.create({
        user: userData ? userData.id : undefined,
        provider: 'razorpay',
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: 'pending',
        receipt: order.receipt,
        raw: order,
      });
    } catch (e) {
      console.error('Transaction create error:', e);
    }

    // Return order details and key id so client can open checkout
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key: process.env.RAZORPAY_KEY_ID,
      order,
      transactionId: transaction ? transaction._id : null,
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Verify and update transaction status (success/failure/cancelled)
app.post('/transactions/verify', async (req, res) => {
  try {
    const { payment_id, order_id, signature, status = 'success', error } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: 'order_id is required' });
    }

    const transaction = await Transaction.findOne({ order_id });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (status === 'success') {
      // Verify signature
      const crypto = require('crypto');
      const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${order_id}|${payment_id}`).digest('hex');
      if (expected !== signature) {
        transaction.status = 'failure';
        transaction.error = 'invalid_signature';
        transaction.payment_id = payment_id;
        transaction.signature = signature;
        await transaction.save();
        return res.status(400).json({ error: 'Invalid signature' });
      }

      transaction.status = 'success';
      transaction.payment_id = payment_id;
      transaction.signature = signature;
      transaction.raw = { payment_id, signature };
      await transaction.save();

      return res.json(transaction);
    } else {
      transaction.status = status === 'cancelled' ? 'cancelled' : 'failure';
      transaction.error = error || 'payment_failed';
      await transaction.save();
      return res.json(transaction);
    }
  } catch (err) {
    console.error('Transaction verify error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get transactions for current user (supports filtering via query params)
app.get('/transactions', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    if (!userData) return res.status(401).json({ error: 'Unauthorized' });

    const { status, provider, q, order_id, payment_id, minAmount, maxAmount, from, to } = req.query;

    const filter = { user: userData.id };

    if (status) filter.status = status;
    if (provider) filter.provider = provider;

    // Exact matching for order_id/payment_id if provided
    if (order_id) {
      filter.order_id = order_id;
    } else if (payment_id) {
      filter.payment_id = payment_id;
    } else if (q) {
      // If q looks like an id, try exact matches first, then regex fallback
      const exactOr = [];
      const regexOr = [];
      exactOr.push({ order_id: q });
      exactOr.push({ payment_id: q });
      regexOr.push({ order_id: { $regex: q, $options: 'i' } });
      regexOr.push({ payment_id: { $regex: q, $options: 'i' } });

      filter.$or = [
        ...exactOr,
        ...regexOr,
      ];
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        // include full day for 'to' date
        toDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = toDate;
      }
    }

    // Debug logging for filter queries (helpful during development)
    // console.debug('transactions filter:', JSON.stringify(filter));

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single transaction by id (authenticated, owner-only)
app.get('/transactions/:id', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    if (!userData) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    if (!transaction.user || transaction.user.toString() !== userData.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(transaction);
  } catch (err) {
    console.error('Get transaction error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  if (!userData) return res.status(401).json({ error: 'Unauthorized' });
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Test endpoint: http://localhost:${PORT}/test`);
});
