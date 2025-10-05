import React, { useEffect, useState } from "react";

function TasksList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  return (
    <div style={{ width: "500px", margin: "50px auto" }}>
      <h2>📋 My Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <b>{task.title}</b> – {task.description || "No description"}
              {task.completed ? " ✅" : " ⏳"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


import React, { useState, useEffect } from "react";

function RemindTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const setReminder = async (id, reminderTime) => {
    await fetch(`http://localhost:5000/api/tasks/setReminder/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reminderTime }),
    });
    alert("✅ Reminder set successfully!");
  };

  return (
    <div style={{ width: "500px", margin: "40px auto" }}>
      <h2>⏰ Set Task Reminder</h2>
      {tasks.map((task) => (
        <div key={task._id} style={{ marginBottom: "20px" }}>
          <b>{task.title}</b>
          <br />
          <input
            type="datetime-local"
            onChange={(e) => setReminder(task._id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}



export default RemindTasks;
