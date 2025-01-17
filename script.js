// Elements
const categoryInput = document.getElementById('category');
const taskInput = document.getElementById('task');
const timeInput = document.getElementById('time');
const addReminderBtn = document.getElementById('addReminder');
const reminderList = document.getElementById('reminderList');

// Load reminders from localStorage
const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
renderReminders();

// Request Notification Permission
if (Notification.permission === 'default') {
  Notification.requestPermission().then((permission) => {
    if (permission !== 'granted') {
      alert('Notifications are disabled. Enable them for better functionality.');
    }
  });
}

// Add reminder
addReminderBtn.addEventListener('click', () => {
  const category = categoryInput.value;
  const taskName = taskInput.value;
  const reminderTime = timeInput.value;

  if (!taskName || !reminderTime) {
    alert('Please enter both task name and time.');
    return;
  }

  const reminder = { category, taskName, reminderTime, id: Date.now() };
  reminders.push(reminder);
  localStorage.setItem('reminders', JSON.stringify(reminders));
  renderReminders();
  scheduleReminder(reminder);

  taskInput.value = '';
  timeInput.value = '';
});

// Render reminders
function renderReminders() {
  reminderList.innerHTML = '';
  reminders.forEach((reminder) => {
    const div = document.createElement('div');
    div.className = 'reminder-item';
    div.textContent = `${reminder.category.toUpperCase()} - ${reminder.taskName} at ${reminder.reminderTime}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.onclick = () => deleteReminder(reminder.id);
    div.appendChild(deleteBtn);
    reminderList.appendChild(div);
  });
}

// Delete reminder
function deleteReminder(id) {
  const index = reminders.findIndex((r) => r.id === id);
  if (index > -1) {
    reminders.splice(index, 1);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    renderReminders();
  }
}

// Schedule reminder with notification
function scheduleReminder(reminder) {
  const now = new Date();
  const [hours, minutes] = reminder.reminderTime.split(':').map(Number);
  const reminderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  const delay = reminderDate.getTime() - now.getTime();
  if (delay > 0) {
    setTimeout(() => {
      showNotification(reminder);
    }, delay);
  }
}

// Show browser notification
function showNotification(reminder) {
  if (Notification.permission === 'granted') {
    const icons = {
      medicinal: 'https://via.placeholder.com/100?text=Med',
      massage: 'https://via.placeholder.com/100?text=Mass',
      exercise: 'https://via.placeholder.com/100?text=Exer',
    };

    new Notification('Reminder', {
      body: `${reminder.category.toUpperCase()} - ${reminder.taskName}`,
      icon: icons[reminder.category] || '',
    });
  } else {
    alert(`${reminder.category.toUpperCase()} - ${reminder.taskName}`);
  }
}
