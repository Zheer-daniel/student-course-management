// Database setup using Node's BUILT-IN SQLite (node:sqlite) — no install/compile needed.
// Requires Node.js v22.5+ (you're on v24, so you're good).
const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const db = new DatabaseSync(path.join(__dirname, "..", "data.db"));

// --- Schema ---
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL,
    email     TEXT NOT NULL UNIQUE,
    matric_no TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS courses (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    code      TEXT NOT NULL UNIQUE,
    title     TEXT NOT NULL,
    credits   INTEGER NOT NULL DEFAULT 3
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id  INTEGER NOT NULL,
    grade      TEXT,
    UNIQUE(student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE
  );
`);

// --- Seed some demo data on first run ---
const count = db.prepare("SELECT COUNT(*) AS c FROM students").get().c;
if (count === 0) {
  const insS = db.prepare("INSERT INTO students (name, email, matric_no) VALUES (?, ?, ?)");
  insS.run("Halan Ahmad", "halan@example.com", "A21CS0001");
  insS.run("Sara Karim", "sara@example.com", "A21CS0002");

  const insC = db.prepare("INSERT INTO courses (code, title, credits) VALUES (?, ?, ?)");
  insC.run("SCSJ4383", "Software Construction", 3);
  insC.run("SCSJ3104", "Database", 3);

  db.prepare("INSERT INTO enrollments (student_id, course_id, grade) VALUES (?, ?, ?)")
    .run(1, 1, "A");
}

module.exports = db;
