const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// تعريف نموذج المهمة
const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,          // ⏰ وقت تنفيذ المهمة
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

// ⏰ مؤقت التذكير (Notification Scheduler)
const schedule = require("node-schedule");

// دالة لتفعيل التذكير
router.post("/setReminder/:id", async (req, res) => {
  try {
    const { reminderTime } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // حفظ وقت التذكير في المهمة
    task.dueDate = reminderTime;
    await task.save();

    // جدولة إشعار وقت التذكير
    const remindDate = new Date(reminderTime);
    const remindBefore = new Date(remindDate.getTime() - 5 * 60000); // قبل 5 دقائق

    schedule.scheduleJob(remindBefore, () => {
      console.log(`🔔 Reminder: "${task.title}" is due soon!`);
    });

    res.json({ msg: "Reminder set successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

const express = require('express');
const Task = require('../models/Task');
const schedule = require('node-schedule');

router.post('/add', async (req, res) => {
  try {
    const { title, description, dueDate, reminderTime, userId } = req.body;
    const newTask = new Task({ title, description, dueDate, reminderTime, userId });
    await newTask.save();

    // جدولة التذكير
    if (reminderTime) {
      schedule.scheduleJob(reminderTime, () => {
      });
    }

    res.json({ message: 'Task created with reminder successfully', task: newTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// البحث عن المهام بالاسم أو التاريخ
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query; // القيمة التي كتبها المستخدم
    const tasks = await Task.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { dueDate: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;