const express = require('express');
const shortid = require('shortid');

const app = express();
app.use(express.static('dist'));

const http = require('http').Server(app);
const io = require('socket.io')(http, { path: '/api/socket.io' });

const rooms = {};

io.on('connection', function(socket) {
  // When client sends a create-room message to the server
  socket.on('create-room', () => {
    const roomId = shortid.generate();

    console.log('Client created a room:', roomId);
    socket.emit('join-room', roomId);

    rooms[roomId] = {
      player1: socket.id,
      player2: null,
      isPlayer1Turn: true,
      gameState: [['', '', ''], ['', '', ''], ['', '', '']]
    };
  });

  // When client sends a join-room message to the server
  socket.on('join-room', roomId => {
    console.log('Client requested to join room:', roomId);
    if (!rooms[roomId]) {
      return;
    }

    rooms[roomId].player2 = socket.id;

    io.to(rooms[roomId].player1).emit('start-game', rooms[roomId].gameState);
    io.to(rooms[roomId].player2).emit('start-game', rooms[roomId].gameState);
  });

  socket.on('square-click', (roomId, row, column) => {
    if (!rooms[roomId]) {
      return;
    }

    // If there was a X or O in that square, don't do anything.
    if (rooms[roomId].gameState[row][column] !== '') {
      return;
    }

    if (rooms[roomId].isPlayer1Turn) {
      // Make sure that if it's player1's turn, the message was sent by player 1.
      if (socket.id !== rooms[roomId].player1) {
        return;
      }

      rooms[roomId].gameState[row][column] = 'X';
    } else {
      // Make sure that if it's player2's turn, the message was sent by player 2.
      if (socket.id !== rooms[roomId].player2) {
        return;
      }

      rooms[roomId].gameState[row][column] = 'O';
    }

    rooms[roomId].isPlayer1Turn = !rooms[roomId].isPlayer1Turn;

    io.to(rooms[roomId].player1).emit('update-board', rooms[roomId].gameState);
    io.to(rooms[roomId].player2).emit('update-board', rooms[roomId].gameState);
  });
});

http.listen(8080, () => console.log('Listening on port 8080!'));
