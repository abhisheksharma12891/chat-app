const socket = io();
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');
const typingDiv = document.getElementById('typing-indicator');
const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login');
const chatContainer = document.querySelector('.chat-container');

let currentUser = '';

// Handle login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  currentUser = document.getElementById('username').value.trim();
  if (currentUser) {
    socket.emit('join', currentUser);
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';
  }
});

// Handle message submission
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('sendMessage', message);
    messageInput.value = '';
  }
});

// Typing indicator
messageInput.addEventListener('input', () => {
  socket.emit('typing');
});

// Socket event listeners
socket.on('message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `
    <span class="username">${data.username}</span>
    <span class="time">${data.time}</span>
    <p class="text">${data.message}</p>
  `;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('typing', (username) => {
  typingDiv.textContent = `${username} is typing...`;
  setTimeout(() => {
    typingDiv.textContent = '';
  }, 3000);
});

socket.on('userJoined', (username) => {
  showNotification(`${username} joined the chat`);
});

socket.on('userLeft', (username) => {
  showNotification(`${username} left the chat`);
});

function showNotification(message) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = message;
  messagesDiv.appendChild(notification);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}