const API_URL = 'http://localhost:8083/api/todo';
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
  const dueDate = document.getElementById('dueDate').value||null;
  if (!title || !description) {
  alert('Please fill in both Title and Description.');
  return;
  }
 

  const newTask = { title, description, dueDate, completed: false };
  const posturl = new URL(API_URL + '/save/task');
  
  try {
    const response = await fetch(posturl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    });

    if (!response.ok) {
        if (response.status === 400) {
            alert('Please fill in both Title and Description.');
        } else {
            alert('Something went wrong. Try again.');
        }
        return;
    }
} catch (error) {
    alert('Network error while creating task.');
    console.error(error);
}

  taskForm.reset();
  fetchTasks();
});

// Toggle complete status
async function toggleComplete(task) {
    const updatedTask = {
    title: task.title,
    dueDate: task.dueDate,
    description: task.description,
    completed: !task.completed // toggle the boolean
  };

 try {
    const response = await fetch(`${API_URL}/update/task/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
    });

    if (!response.ok) {
        if (response.status === 404) {
            alert('Task not found.');
        } else {
            alert('Failed to update task.');
        }
    }
} catch (error) {
    alert('Network error while updating task.');
    console.error(error);
}
  
  fetchTasks();
}

// Delete task
async function deleteTask(id) {
  try {
    const response = await fetch(`${API_URL}/delete/task/${id}`, {
        method: 'DELETE'
    });

    if (response.status === 404) {
        alert('Task not found. It may already be deleted.');
    } else if (!response.ok) {
        alert('Failed to delete task.');
    }
    else{

        fetchTasks();
    }
} catch (error) {
    alert('Network error while deleting task.');
    console.error(error);
}

}

// Initial load
fetchTasks();
