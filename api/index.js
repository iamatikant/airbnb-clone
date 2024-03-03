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

mongoose.connect(process.env.MONGO_URL);

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
  const newName = "photos" + Date.now() + ".jpg";
  try {
    const response = await imageDownloader.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });
    res.json(newName);
  } catch (err) {
    res.status(422).json(err);
  }
});

app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
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

app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.listen(4000);
