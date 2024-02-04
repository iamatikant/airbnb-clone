const express = require("express");
require('dotenv').config();
const bcrypt = require('bcryptjs');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");
const UserModel = require("./models/User");

const app = express();
app.use(express.json());

const whitelist = ['http://localhost:5173']; // Add your localhost URL

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'this_is_jwt_secret';

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json({
    test: "working fine",
  });
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.create({name, email, password: bcrypt.hashSync(password, bcryptSalt) });
    res.json(user);
  } catch(e) {
    res.status(422).json(e);
  }
});

app.post("/login", async(req, res) => {
  const {email, password} = req.body;
  console.log(email, password, "test");
  const user = await UserModel.findOne({email});
  if(!user) {
    res.status(422).json('Invalid user');
    return;
  }
  const isValidPassword = bcrypt.compareSync(password, user.password);
  if(!isValidPassword) {
    res.status(422).json('Invalid password');
    return;
  }
  try{
    // const token = await jwt.sign({ email: user.email, id: user._id }, jwtSecret);
    jwt.sign({ email: user.email, id: user._id }, jwtSecret, {}, (err, token) => {
      if(err) {
        throw err;
      }
      res.cookie('token', token).json('pass ok');
    })
    // res.status(200).cookie('token', token).json('pass ok');
    
  } catch (e) {
    res.json(401).json('cookie not set');
  }
})



app.listen(4000);