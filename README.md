# Student & Course Management System

A simple **Student & Course Management** web application built with the **Node.js + Express** framework.
Built for SCSJ4383 (Software Construction) — Assignment 2.

## Framework & Tech
- **Express.js** — web framework (routing, middleware)
- **node:sqlite** — Node's built-in SQLite (requires Node.js v22.5+, no install/compile)
- Vanilla HTML/CSS/JS frontend

## Five (5) Functionalities
1. **Manage Students** — add, view, edit, delete students *(REST web service)*
2. **Manage Courses** — add, view, edit, delete courses *(REST web service)*
3. **Enroll Student in Course** — link a student to a course with an optional grade
4. **View a Student's Courses** — list all courses a student is enrolled in
5. **Search Students** — search students by name

## Two (2) RESTful Web Services
Both follow REST conventions (resource URLs + HTTP verbs + JSON).

### 1. Students — `/api/students`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/students`        | List all students (`?search=name` to filter) |
| GET    | `/api/students/:id`    | Get one student |
| POST   | `/api/students`        | Create a student |
| PUT    | `/api/students/:id`    | Update a student |
| DELETE | `/api/students/:id`    | Delete a student |

### 2. Courses — `/api/courses`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/courses`        | List all courses |
| GET    | `/api/courses/:id`    | Get one course |
| POST   | `/api/courses`        | Create a course |
| PUT    | `/api/courses/:id`    | Update a course |
| DELETE | `/api/courses/:id`    | Delete a course |

### Enrollment endpoints (Features 3 & 4)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/enrollments`            | Enroll a student in a course |
| GET    | `/api/students/:id/courses`   | View a student's courses |

## How to Run
```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start the server
npm start
```
Then open **http://localhost:3000** in your browser.

## Example REST calls
```bash
# Get all students
curl http://localhost:3000/api/students

# Create a student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali","email":"ali@utm.my","matric_no":"A21CS1234"}'

# Create a course
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"code":"SCSJ4383","title":"Software Construction","credits":3}'
```

## Project Structure
```
student-course-management/
├── src/
│   ├── server.js     # Express app + all routes (REST services)
│   └── db.js         # Database schema + connection
├── public/           # Frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .env.example
├── .gitignore
└── package.json
```
