import React, { useEffect, useState } from "react";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;

  // المهام القادمة خلال 3 أيام
  const upcoming = tasks.filter((t) => {
    const now = new Date();
    const due = new Date(t.dueDate);
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  });

  return (
    <div style={{ width: "600px", margin: "40px auto" }}>
      <h2>📊 Task Dashboard</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          background: "#eee",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <div>📋 Total: {total}</div>
        <div>✅ Completed: {completed}</div>
        <div>🕓 Pending: {pending}</div>
      </div>

      <h3 style={{ marginTop: "30px" }}>⏰ Upcoming Tasks (Next 3 days)</h3>
      {upcoming.length === 0 ? (
        <p>No upcoming tasks.</p>
      ) : (
        <ul>
          {upcoming.map((task) => (
            <li key={task._id}>
              <b>{task.title}</b> – due on{" "}
              {new Date(task.dueDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
