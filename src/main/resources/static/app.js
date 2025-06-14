const API_URL = 'http://localhost:8082/api/todo';
const taskList = document.getElementById('taskList');
const taskForm = document.getElementById('taskForm');
const taskTemplate = document.getElementById('taskItemTemplate');

// Fetch and render all tasks
async function fetchTasks() {
  const response = await fetch(API_URL+'/get/tasks');
  const tasks = await response.json();
  taskList.innerHTML = '';
  tasks.reverse().forEach(task => renderTask(task));
}

// Render a single task
function renderTask(task) {
  const clone = taskTemplate.content.cloneNode(true);
  const li = clone.querySelector('li');

  const titleEl = li.querySelector('.task-title');
  const descEl = li.querySelector('.task-desc');
  const dateEl = li.querySelector('.task-date');

  titleEl.textContent = task.title;
  descEl.textContent = task.description;
  dateEl.textContent = `Due: ${task.dueDate}`;

  if (task.completed) {
    titleEl.classList.add('done');
  }

  li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(task));
  li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

  taskList.appendChild(clone);
}

// Add new task
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const dueDate = document.getElementById('dueDate').value;

  const newTask = { title, description, dueDate, completed: false };
  const posturl = new URL(API_URL + '/save/task');
  await fetch(posturl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask)
  });

  taskForm.reset();
  fetchTasks();
});

// Toggle complete status
async function toggleComplete(task) {
  const updatedTask = { ...task, completed: !task.completed };
  await fetch(`${API_URL}/update/task/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask)
  });
  fetchTasks();
}

// Delete task
async function deleteTask(id) {
  await fetch(`${API_URL}/delete/task/${id}`, { method: 'DELETE' });
  fetchTasks();
}

// Initial load
fetchTasks();
