const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Register User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.json({ msg: "User registered successfully!" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
