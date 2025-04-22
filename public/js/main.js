const socket = io();
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');
const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login');
const chatContainer = document.querySelector('.chat-container');

let currentUser = '';
let typingTimeout;

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

// Typing indicator with debounce
messageInput.addEventListener('input', () => {
  socket.emit('typing', true);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing', false);
  }, 1000);
});

messageInput.addEventListener('blur', () => {
  clearTimeout(typingTimeout);
  socket.emit('typing', false);
});

// Handle message submission
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('sendMessage', message);
    messageInput.value = '';
    clearTimeout(typingTimeout);
    socket.emit('typing', false);
  }
});

// Display messages
socket.on('message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  messageElement.innerHTML = `
    <span class="user">${data.user}</span>
    <span class="time">${data.time}</span>
    <p class="text">${data.text}</p>
  `;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Handle typing status
socket.on('typingStatus', (typingUsers) => {
  const otherUsers = typingUsers.filter(user => user !== currentUser);
  if (otherUsers.length > 0) {
    typingIndicator.textContent = 
      otherUsers.length === 1 
        ? `${otherUsers[0]} is typing...` 
        : `${otherUsers.join(' and ')} are typing...`;
  } else {
    typingIndicator.textContent = '';
  }
});

// Handle user notifications
socket.on('userJoined', (username) => {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = `${username} joined the chat`;
  messagesDiv.appendChild(notification);
});

socket.on('userLeft', (username) => {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = `${username} left the chat`;
  messagesDiv.appendChild(notification);
});