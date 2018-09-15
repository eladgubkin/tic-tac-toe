import React, { Component } from 'react';
import './TicTacToe.css';
import 'animate.css';
import _ from 'lodash';
import { checkWinner } from './GameLogic';

class TicTacToe extends Component {
  onSquareClicked(index) {
    const row = Math.floor(index / 3);
    const column = index % 3;

    this.props.onSquareClicked(row, column);
  }
  
  renderShape(item) { 
    if (item === '') {
      return null;
    }

    return (
      <div className="animated bounceIn">
        <div className={item === 'X' ? 'tictactoe-x' : 'tictactoe-o'}>
        </div>
      </div>
    );
  }

  render() {
    const squares = _.flatten(this.props.board).map((item, index) => 
      <div className="tictactoe-square" onClick={() => this.onSquareClicked(index)}>
        {this.renderShape(item)}
      </div>
    );

    return (
      <div className={`tictactoe ${checkWinner(this.props.board)}`}>
        {squares}
      </div>
    );
  }
}

export default TicTacToe;
