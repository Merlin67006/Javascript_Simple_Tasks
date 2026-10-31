import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending"
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Fetch tasks from backend
  async function loadTasks() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Unable to load tasks");

      const data = await response.json();
      setTasks(data);
      setError("");
    } catch {
      setError("Cannot connect to the server. Check the backend.");
    }
  }

useEffect(() => {
  async function fetchStudents() {
    const res = await fetch(API);
    const data = await res.json();
    setTasks(data);
  }

  fetchStudents();
}, []);

  // Handle form inputs
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Add or update task
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        editId ? `${API}/${editId}` : API,
        {
          method: editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      setForm({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending"
      });

      setEditId(null);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  // Edit task
  function editTask(task) {
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status
    });

    setEditId(task._id);
  }

  // Delete task
  async function deleteTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Unable to delete task");

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <h1>Student Task Manager</h1>
      <p className="subtitle">Organize your study tasks efficiently</p>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Task Description"
          value={form.description}
          onChange={handleChange}
        />

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit">
          {editId ? "Update Task" : "Add Task"}
        </button>

        {editId && (
          <button
            type="button"
            className="cancel"
            onClick={() => {
              setEditId(null);
              setForm({
                title: "",
                description: "",
                priority: "Medium",
                status: "Pending"
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <h2>My Tasks ({tasks.length})</h2>

      <div className="task-list">
        {tasks.map(task => (
          <div className="task-card" key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description || "No description"}</p>

            <p>
              Priority:{" "}
              <span className={`priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </p>

            <label>
              Status:{" "}
              <select
                value={task.status}
                onChange={async (e) => {
                  try {
                    const response = await fetch(`${API}/${task._id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({ status: e.target.value })
                    });

                    if (!response.ok) {
                      throw new Error("Unable to update status");
                    }

                    await loadTasks();
                  } catch (err) {
                    setError(err.message);
                  }
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <div className="actions">
              <button onClick={() => editTask(task)}>Edit</button>
              <button
                className="delete"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && !error && (
          <p className="empty">No tasks yet. Add your first task!</p>
        )}
      </div>
    </div>
  );
}

export default App;