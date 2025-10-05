import React, { useState } from "react";

function AddTask() {
  const [task, setTask] = useState({ title: "", description: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    setMessage(data.msg);

    if (res.ok) {
      setTask({ title: "", description: "" });
    }
  };

  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <h2>➕ Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Task Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
        <button type="submit">Add Task</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default AddTask;
