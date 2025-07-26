const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
const searchInput = document.getElementById('searchInput');

// Load students from localStorage
let students = JSON.parse(localStorage.getItem('students')) || [];

// Show students on load
displayStudents(students);

// Handle form submission
studentForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const courseField = document.getElementById('course');

  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const course = courseField.value.trim();

  // Check for empty fields
  if (!name || !email || !course) {
    [nameField, emailField, courseField].forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('shake');
        setTimeout(() => field.classList.remove('shake'), 300);
      }
    });
    return;
  }

  const newStudent = { name, email, course };
  students.push(newStudent);
  localStorage.setItem('students', JSON.stringify(students));
  displayStudents(students);
  studentForm.reset();
});

// Real-time search with "starts with" priority
searchInput.addEventListener('input', function () {
  const query = this.value.toLowerCase();

  const filtered = students
    .filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.course.toLowerCase().includes(query)
    )
    .sort((a, b) => {
      const aStarts = startsWithQuery(a, query);
      const bStarts = startsWithQuery(b, query);
      return bStarts - aStarts; // prioritize those starting with query
    });

  displayStudents(filtered);
});

// Helper to check if any field starts with query
function startsWithQuery(student, query) {
  return (
    student.name.toLowerCase().startsWith(query) ||
    student.email.toLowerCase().startsWith(query) ||
    student.course.toLowerCase().startsWith(query)
  ) ? 1 : 0;
}

// Display function
function displayStudents(data) {
  studentList.innerHTML = '';

  if (data.length === 0) {
    studentList.innerHTML = '<tr><td colspan="4">No students found.</td></tr>';
    return;
  }

  data.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.course}</td>
      <td><button class="delete-btn" onclick="deleteStudent(${index})">🗑</button></td>
    `;
    studentList.appendChild(row);
  });
}

// Delete function
function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    displayStudents(students);
  }
}
