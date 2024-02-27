const express = require("express");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cookieParser());

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
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        throw err;
      }
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
  // res.json("User info");
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
    res.json({ newName });
  } catch (err) {
    res.status(422).json(err);
  }
});

const photosMiddleware = multer({ dest: "uploads/" });
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
  console.log(uploadedFiles);
  res.json(uploadedFiles);
});

app.listen(4000);
