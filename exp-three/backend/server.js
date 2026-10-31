const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/courseDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// Course Schema
const Course = mongoose.model("Course", new mongoose.Schema({
  courseName: String,
  courseCode: String,
  department: String,
  credits: Number
}));

// Student Registration Schema
const Registration = mongoose.model("Registration", new mongoose.Schema({
  studentName: String,
  email: String,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
}));

// Add Course
app.post("/courses", async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
});

// Get Available Courses
app.get("/courses", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Register Student
app.post("/register", async (req, res) => {
  const registration = await Registration.create(req.body);
  res.status(201).json(registration);
});

// View Registrations
app.get("/registrations", async (req, res) => {
  const registrations = await Registration.find().populate("courseId");
  res.json(registrations);
});

// Cancel Registration
app.delete("/register/:id", async (req, res) => {
  await Registration.findByIdAndDelete(req.params.id);
  res.json({ message: "Registration cancelled successfully" });
});

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});