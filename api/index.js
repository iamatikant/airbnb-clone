const express = require("express");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    credentials: true,
    // origin: "*",
  })
);

app.get("/test", (req, res) => {
  res.json({
    test: "working fine",
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  res.json({ name, email, password });
});

app.listen(4000);
