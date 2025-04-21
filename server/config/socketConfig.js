module.exports = (io) => {
  const users = {};
  
  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Handle new user joining
    socket.on('join', (username) => {
      users[socket.id] = username;
      socket.broadcast.emit('userJoined', username);
      console.log(`${username} joined the chat`);
    });

    // Handle messages
    socket.on('sendMessage', (message) => {
      const username = users[socket.id];
      if (username) {
        io.emit('message', {
          username,
          message,
          time: new Date().toLocaleTimeString()
        });
      }
    });

    // Handle typing indicator
    socket.on('typing', () => {
      const username = users[socket.id];
      if (username) {
        socket.broadcast.emit('typing', username);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const username = users[socket.id];
      if (username) {
        io.emit('userLeft', username);
        console.log(`${username} left the chat`);
        delete users[socket.id];
      }
    });
  });
};