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

// 📌 إضافة مهمة جديدة
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ msg: "Title is required" });

    const newTask = new Task({
      title,
      description,
      completed: false,
    });

    await newTask.save();
    res.json({ msg: "Task added successfully", task: newTask });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
