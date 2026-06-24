require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// =====================================================================
//  FEATURE 1 + REST WEB SERVICE #1 : STUDENTS  (full CRUD, JSON)
//  Base route: /api/students
// =====================================================================

// GET all students  (with optional ?search=name  -> FEATURE 5: search)
app.get("/api/students", (req, res) => {
  const { search } = req.query;
  let rows;
  if (search) {
    rows = db
      .prepare("SELECT * FROM students WHERE name LIKE ? ORDER BY id")
      .all(`%${search}%`);
  } else {
    rows = db.prepare("SELECT * FROM students ORDER BY id").all();
  }
  res.json(rows);
});

// GET one student
app.get("/api/students/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Student not found" });
  res.json(row);
});

// CREATE student
app.post("/api/students", (req, res) => {
  const { name, email, matric_no } = req.body;
  if (!name || !email || !matric_no) {
    return res.status(400).json({ error: "name, email and matric_no are required" });
  }
  try {
    const info = db
      .prepare("INSERT INTO students (name, email, matric_no) VALUES (?, ?, ?)")
      .run(name, email, matric_no);
    res.status(201).json({ id: info.lastInsertRowid, name, email, matric_no });
  } catch (e) {
    res.status(400).json({ error: "Email or matric number already exists" });
  }
});

// UPDATE student
app.put("/api/students/:id", (req, res) => {
  const { name, email, matric_no } = req.body;
  const info = db
    .prepare("UPDATE students SET name = ?, email = ?, matric_no = ? WHERE id = ?")
    .run(name, email, matric_no, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Student not found" });
  res.json({ id: Number(req.params.id), name, email, matric_no });
});

// DELETE student
app.delete("/api/students/:id", (req, res) => {
  const info = db.prepare("DELETE FROM students WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Student not found" });
  res.json({ message: "Student deleted" });
});

// =====================================================================
//  FEATURE 2 + REST WEB SERVICE #2 : COURSES  (full CRUD, JSON)
//  Base route: /api/courses
// =====================================================================

app.get("/api/courses", (req, res) => {
  res.json(db.prepare("SELECT * FROM courses ORDER BY id").all());
});

app.get("/api/courses/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Course not found" });
  res.json(row);
});

app.post("/api/courses", (req, res) => {
  const { code, title, credits } = req.body;
  if (!code || !title) {
    return res.status(400).json({ error: "code and title are required" });
  }
  try {
    const info = db
      .prepare("INSERT INTO courses (code, title, credits) VALUES (?, ?, ?)")
      .run(code, title, credits || 3);
    res.status(201).json({ id: info.lastInsertRowid, code, title, credits: credits || 3 });
  } catch (e) {
    res.status(400).json({ error: "Course code already exists" });
  }
});

app.put("/api/courses/:id", (req, res) => {
  const { code, title, credits } = req.body;
  const info = db
    .prepare("UPDATE courses SET code = ?, title = ?, credits = ? WHERE id = ?")
    .run(code, title, credits, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Course not found" });
  res.json({ id: Number(req.params.id), code, title, credits });
});

app.delete("/api/courses/:id", (req, res) => {
  const info = db.prepare("DELETE FROM courses WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Course not found" });
  res.json({ message: "Course deleted" });
});

// =====================================================================
//  FEATURE 3 : ENROLL a student into a course
//  FEATURE 4 : VIEW a student's enrolled courses
// =====================================================================

// Enroll
app.post("/api/enrollments", (req, res) => {
  const { student_id, course_id, grade } = req.body;
  if (!student_id || !course_id) {
    return res.status(400).json({ error: "student_id and course_id are required" });
  }
  try {
    const info = db
      .prepare("INSERT INTO enrollments (student_id, course_id, grade) VALUES (?, ?, ?)")
      .run(student_id, course_id, grade || null);
    res.status(201).json({ id: info.lastInsertRowid, student_id, course_id, grade });
  } catch (e) {
    res.status(400).json({ error: "Student already enrolled in this course" });
  }
});

// View one student's courses (joined)
app.get("/api/students/:id/courses", (req, res) => {
  const rows = db
    .prepare(
      `SELECT e.id AS enrollment_id, c.code, c.title, c.credits, e.grade
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.student_id = ?`
    )
    .all(req.params.id);
  res.json(rows);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
