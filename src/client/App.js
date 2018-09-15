import React, { Component } from 'react';
import io from 'socket.io-client';
import TicTacToe from './TicTacToe';

class App extends Component {
  constructor() {
    super();
    this.state = {
      roomId: null,
      board: null,
    };
  }

  componentDidMount() {
    this.socket = io('/', {
      path: '/api/socket.io',
    });

    const roomId = window.location.hash.replace('#', '');
    if (roomId) {
      // Client wants to join an existing room.
      this.setState({
        ...this.state,
        roomId,
      });

      this.socket.emit('join-room', roomId);
    } else {
      this.socket.emit('create-room');
      this.socket.on('join-room', (roomId) => {
        this.setState({
          ...this.state,
          roomId,
        })
      });
    }

    this.socket.on('start-game', (board) => {
      this.setState({
        ...this.state,
        board,
      });
    });

    this.socket.on('update-board', (board) => {
      this.setState({
        ...this.state,
        board,
      })
    });
  }

  onSquareClicked = (row, column) => {
    this.socket.emit('square-click', this.state.roomId, row, column);
  };

  render() {
    if (this.state.board) {
      return <TicTacToe board={this.state.board} onSquareClicked={this.onSquareClicked} />;
    }

    const url = `${window.location.href}#${this.state.roomId}`;

    return (
      <div>
        <h1>Share this URL with a friend:</h1>
        <a href={url}>{url}</a>
      </div>
    );
  }
}

export default App;
