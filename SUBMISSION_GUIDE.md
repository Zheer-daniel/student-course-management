# Submission Guide (Git + Video)

## 1. Push to GitHub (run these manually)

First create an EMPTY repo on github.com (no README, no .gitignore) named e.g. `student-course-management`.
Then, from inside the project folder:

```bash
cd "C:\Users\Asus\Desktop\student-course-management"

git init
git checkout -b main
git add .
git commit -m "feat: student & course management with Express + REST"
git remote add origin https://github.com/<your-username>/student-course-management.git
git push -u origin main
```

### If you want the proper branch workflow (optional, matches your preference)
```bash
git init
git checkout -b dev
git add .
git commit -m "feat: initial student & course management app"
git checkout -b main
# push both
git push -u origin dev
git push -u origin main
```

> `.env` and `node_modules/` are already git-ignored, so no secrets or junk get pushed.

## 2. Verify install works on a clean machine
The grader (or you) just need:
```bash
npm install
npm start
```
`better-sqlite3` downloads a prebuilt binary on Windows automatically — no extra setup.

## 3. Video Script (keep it under 2 minutes)

**0:00–0:20 — Framework setup**
> "I used the Express framework with Node.js. Here's package.json — Express handles routing and middleware. I install with `npm install` and run with `npm start`. The entry point is src/server.js where I create the Express app, add JSON and static middleware."

**0:20–0:50 — REST web services setup**
> "I have two RESTful web services: students and courses. Show src/server.js. Each resource uses REST conventions — GET to read, POST to create, PUT to update, DELETE to remove, all returning JSON. Point at the `/api/students` and `/api/courses` route blocks."
> Optionally show a `curl` call or the browser hitting `http://localhost:3000/api/students` returning JSON.

**0:50–1:50 — Demo the 5 features** (use the web UI at localhost:3000)
1. Add a student (and edit/delete one)
2. Add a course
3. Enroll the student in the course
4. Select the student to view their courses
5. Type in the search box to filter students

**1:50–2:00 — Wrap up**
> "That's five features built on Express, with students and courses exposed as RESTful web services. Source code is on GitHub."

### Recording tips
- Use the built-in Windows **Xbox Game Bar** (Win+G) or OBS to record.
- Export as .mp4, keep it under 200MB (a 2-min screen recording is usually well under that).
- Talk while clicking — no need to be perfect, just hit the three points: framework setup, REST setup, demo.
```
```
