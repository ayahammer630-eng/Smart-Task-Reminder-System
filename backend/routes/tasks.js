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


// ✏️ تعديل مهمة (Edit Task)
router.put("/:id", async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true }
    );
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json({ msg: "Task updated successfully", task });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// 🗑️ حذف مهمة (Delete Task)
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
