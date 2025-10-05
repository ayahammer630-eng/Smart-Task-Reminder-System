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

export default TasksList;
