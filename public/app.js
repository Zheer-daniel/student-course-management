const api = (path, opts) => fetch("/api" + path, opts).then((r) => r.json());

// ---------- STUDENTS ----------
async function loadStudents(search = "") {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  const students = await api(`/students${q}`);
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = students
    .map(
      (s) => `<tr>
        <td>${s.id}</td><td>${s.name}</td><td>${s.email}</td><td>${s.matric_no}</td>
        <td>
          <button onclick="editStudent(${s.id}, '${s.name}', '${s.email}', '${s.matric_no}')">Edit</button>
          <button class="del" onclick="deleteStudent(${s.id})">Delete</button>
        </td>
      </tr>`
    )
    .join("");
  fillStudentDropdowns(students);
}

function fillStudentDropdowns(students) {
  const opts = students.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
  document.getElementById("eStudent").innerHTML = opts;
  document.getElementById("viewStudent").innerHTML = opts;
}

document.getElementById("studentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("studentId").value;
  const body = JSON.stringify({
    name: document.getElementById("sName").value,
    email: document.getElementById("sEmail").value,
    matric_no: document.getElementById("sMatric").value,
  });
  const opts = { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body };
  const res = await api(id ? `/students/${id}` : "/students", opts);
  if (res.error) return alert(res.error);
  e.target.reset();
  document.getElementById("studentId").value = "";
  loadStudents();
});

window.editStudent = (id, name, email, matric) => {
  document.getElementById("studentId").value = id;
  document.getElementById("sName").value = name;
  document.getElementById("sEmail").value = email;
  document.getElementById("sMatric").value = matric;
};

window.deleteStudent = async (id) => {
  if (!confirm("Delete this student?")) return;
  await api(`/students/${id}`, { method: "DELETE" });
  loadStudents();
};

document.getElementById("sReset").onclick = () => {
  document.getElementById("studentForm").reset();
  document.getElementById("studentId").value = "";
};

document.getElementById("sSearch").addEventListener("input", (e) => loadStudents(e.target.value));

// ---------- COURSES ----------
async function loadCourses() {
  const courses = await api("/courses");
  const tbody = document.querySelector("#courseTable tbody");
  tbody.innerHTML = courses
    .map(
      (c) => `<tr>
        <td>${c.id}</td><td>${c.code}</td><td>${c.title}</td><td>${c.credits}</td>
        <td>
          <button onclick="editCourse(${c.id}, '${c.code}', '${c.title}', ${c.credits})">Edit</button>
          <button class="del" onclick="deleteCourse(${c.id})">Delete</button>
        </td>
      </tr>`
    )
    .join("");
  document.getElementById("eCourse").innerHTML = courses
    .map((c) => `<option value="${c.id}">${c.code} - ${c.title}</option>`)
    .join("");
}

document.getElementById("courseForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("courseId").value;
  const body = JSON.stringify({
    code: document.getElementById("cCode").value,
    title: document.getElementById("cTitle").value,
    credits: Number(document.getElementById("cCredits").value),
  });
  const opts = { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body };
  const res = await api(id ? `/courses/${id}` : "/courses", opts);
  if (res.error) return alert(res.error);
  e.target.reset();
  document.getElementById("courseId").value = "";
  loadCourses();
});

window.editCourse = (id, code, title, credits) => {
  document.getElementById("courseId").value = id;
  document.getElementById("cCode").value = code;
  document.getElementById("cTitle").value = title;
  document.getElementById("cCredits").value = credits;
};

window.deleteCourse = async (id) => {
  if (!confirm("Delete this course?")) return;
  await api(`/courses/${id}`, { method: "DELETE" });
  loadCourses();
};

document.getElementById("cReset").onclick = () => {
  document.getElementById("courseForm").reset();
  document.getElementById("courseId").value = "";
};

// ---------- ENROLLMENTS ----------
document.getElementById("enrollForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = JSON.stringify({
    student_id: Number(document.getElementById("eStudent").value),
    course_id: Number(document.getElementById("eCourse").value),
    grade: document.getElementById("eGrade").value || null,
  });
  const res = await api("/enrollments", { method: "POST", headers: { "Content-Type": "application/json" }, body });
  if (res.error) return alert(res.error);
  e.target.reset();
  alert("Enrolled successfully");
  loadEnrollments();
});

async function loadEnrollments() {
  const id = document.getElementById("viewStudent").value;
  if (!id) return;
  const rows = await api(`/students/${id}/courses`);
  const tbody = document.querySelector("#enrollTable tbody");
  tbody.innerHTML = rows
    .map((r) => `<tr><td>${r.code}</td><td>${r.title}</td><td>${r.credits}</td><td>${r.grade || "-"}</td></tr>`)
    .join("");
}

document.getElementById("viewStudent").addEventListener("change", loadEnrollments);

// ---------- INIT ----------
(async () => {
  await loadStudents();
  await loadCourses();
  loadEnrollments();
})();
