module.exports = (io) => {
  const users = {};
  const typingUsers = {};

  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // Handle new user joining
    socket.on('join', (username) => {
      users[socket.id] = username;
      io.emit('userJoined', username);
      socket.emit('message', {
        user: 'System',
        text: `Welcome ${username}!`,
        time: new Date().toLocaleTimeString()
      });
    });

    // Handle messages
    socket.on('sendMessage', (message) => {
      const username = users[socket.id];
      if (username && message.trim()) {
        // Clear typing status when sending message
        typingUsers[socket.id] = false;
        io.emit('typingStatus', getTypingUsers());
        
        io.emit('message', {
          user: username,
          text: message,
          time: new Date().toLocaleTimeString()
        });
      }
    });

    // Handle typing events
    socket.on('typing', (isTyping) => {
      const username = users[socket.id];
      if (username) {
        typingUsers[socket.id] = isTyping;
        io.emit('typingStatus', getTypingUsers());
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const username = users[socket.id];
      if (username) {
        io.emit('userLeft', username);
        delete users[socket.id];
        delete typingUsers[socket.id];
        io.emit('typingStatus', getTypingUsers());
      }
    });

    // Helper function to get currently typing users
    function getTypingUsers() {
      return Object.entries(typingUsers)
        .filter(([id, isTyping]) => isTyping && users[id])
        .map(([id]) => users[id]);
    }
  });
};