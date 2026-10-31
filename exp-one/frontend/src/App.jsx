import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    regNo: "",
    department: "",
    email: ""
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Load students when the component mounts
  useEffect(() => {
    const controller = new AbortController();

    async function fetchStudents() {
      try {
        const response = await fetch(API, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to load students");
        }

        const data = await response.json();
        setStudents(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Cannot connect to the server.");
        }
      }
    }

    fetchStudents();

    return () => controller.abort();
  }, []);

  // Handle form inputs
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  // Add or update a student
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        editId ? `${API}/${editId}` : API,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      setForm({
        name: "",
        regNo: "",
        department: "",
        email: ""
      });

      setEditId(null);
      await loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  // Fetch updated student list
  async function loadStudents() {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Unable to load students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // Select student for editing
  function editStudent(student) {
    setForm({
      name: student.name,
      regNo: student.regNo,
      department: student.department,
      email: student.email
    });

    setEditId(student._id);
  }

  // Delete student
  async function deleteStudent(id) {
    setError("");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      await loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <h1>Student Management System</h1>

      <h2>{editId ? "Update Student" : "Add Student"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Student Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="regNo"
          placeholder="Register Number"
          value={form.regNo}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editId ? "Update Student" : "Add Student"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({
                name: "",
                regNo: "",
                department: "",
                email: ""
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Student Records</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Register No.</th>
            <th>Department</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.regNo}</td>
              <td>{student.department}</td>
              <td>{student.email}</td>
              <td>
                <button onClick={() => editStudent(student)}>
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() => deleteStudent(student._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {students.length === 0 && (
            <tr>
              <td colSpan="5">No students found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;