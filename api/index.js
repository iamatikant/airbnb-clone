const express = require("express");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const Place = require("./models/Place");
const Booking = require("./models/Booking");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const Razorpay = require('razorpay');

const app = express();
app.use(express.json());
app.use(cookieParser());
const photosMiddleware = multer({ dest: "uploads/" });

app.use("/uploads", express.static(__dirname + "/uploads"));

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
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
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

    // Return order details and key id so client can open checkout
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Test endpoint: http://localhost:${PORT}/test`);
});
