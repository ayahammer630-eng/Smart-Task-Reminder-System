const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// تعريف نموذج المهمة
const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
  })
);

// 📌 عرض جميع المهام
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
