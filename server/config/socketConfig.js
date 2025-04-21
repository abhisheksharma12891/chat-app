// server/config/socketConfig.js
module.exports = function(io) {
    io.on('connection', (socket) => {
      console.log('New connection:', socket.id);
      // Your socket.io logic here
    });
  };