// Run after the HTML is fully parsed
document.addEventListener('DOMContentLoaded', () => {
  // 1) Select DOM elements (use exact names required)
  const addButton = document.getElementById('add-task-btn');
  const taskInput = document.getElementById('task-input');
  const taskList  = document.getElementById('task-list');

  // -----------------------------
  // Helpers for Local Storage
  // -----------------------------

  // Get tasks array from localStorage (always returns an array)
  function getStoredTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  }

  // Save the given array to localStorage
  function setStoredTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Save a single task (string) to storage
  function saveTask(taskText) {
    const tasks = getStoredTasks();
    tasks.push(taskText);
    setStoredTasks(tasks);
  }

  // Remove the FIRST matching task string from storage
  function removeTaskFromStorage(taskText) {
    const tasks = getStoredTasks();
    const idx = tasks.indexOf(taskText);
    if (idx > -1) {
      tasks.splice(idx, 1);
      setStoredTasks(tasks);
    }
  }

  // -----------------------------
  // DOM creation logic
  // -----------------------------

  // Create <li> with text + remove button, and wire remove behavior
  function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.textContent = taskText;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-btn';

    // When clicked: remove from DOM and from storage
    removeBtn.onclick = function () {
      taskList.removeChild(li);
      removeTaskFromStorage(taskText);
    };

    li.appendChild(removeBtn);
    return li;
  }

  // -----------------------------
  // Core: addTask
  // -----------------------------
  /**
   * Adds a task to the UI (and optionally to localStorage).
   * @param {string} taskTextParam - Optional text when loading from storage.
   * @param {boolean} save - Whether to save to localStorage (default true).
   */
  function addTask(taskTextParam, save = true) {
    const raw = (typeof taskTextParam === 'string') ? taskTextParam : taskInput.value;
    const taskText = raw.trim();

    // Validate: must not be empty
    if (taskText === '') {
      alert('Please enter a task');
      return;
    }

    // Create and append to the list
    const li = createTaskElement(taskText);
    taskList.appendChild(li);

    // Save to localStorage if this is a user-add event
    if (save) {
      saveTask(taskText);
    }

    // Clear input for next entry
    taskInput.value = '';
    taskInput.focus();
  }

  // -----------------------------
  // Load tasks from localStorage on startup
  // -----------------------------
  function loadTasks() {
    const storedTasks = getStoredTasks();
    storedTasks.forEach(taskText => addTask(taskText, false)); // false => don't re-save
  }

  // -----------------------------
  // Wire up events
  // -----------------------------
  addButton.addEventListener('click', () => addTask());

  // Allow Enter key to add task
  taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  });

  // Initialize app
  loadTasks();
});
