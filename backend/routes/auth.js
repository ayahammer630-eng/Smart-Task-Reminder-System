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

const jwt = require("jsonwebtoken");

// ✅ تسجيل الدخول
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // التأكد من وجود المستخدم
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // التحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // إنشاء Token لتأمين الجلسة
    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });

    res.json({ msg: "Login successful", token });
  } catch (err) {
    res.status(500).send("Server error");
  }
});