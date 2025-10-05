import React, { useEffect, useState } from "react";

function TasksList() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });

  // 🟢 جلب المهام من الخادم
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✏️ تعديل مهمة
  const handleEdit = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditTask(null);
    fetchTasks();
  };

  // 🗑️ حذف مهمة
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    });
    fetchTasks();
  };

  return (
    <div style={{ width: "500px", margin: "50px auto" }}>
      <h2>📝 My Tasks</h2>
      {tasks.map((task) => (
        <div
          key={task._id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          {editTask === task._id ? (
            <>
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <button onClick={() => handleEdit(task._id)}>💾 Save</button>
              <button onClick={() => setEditTask(null)}>❌ Cancel</button>
            </>
          ) : (
            <>
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <button
                onClick={() => {
                  setEditTask(task._id);
                  setForm({
                    title: task.title,
                    description: task.description,
                  });
                }}
              >
                ✏️ Edit
              </button>
              <button onClick={() => handleDelete(task._id)}>🗑️ Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TasksList;
