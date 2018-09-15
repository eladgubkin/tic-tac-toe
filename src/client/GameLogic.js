function checkRowWinner(board) {
  for (let index = 0; index < 3; index++) {
    const row = board[index];

    let xCount = 0;
    let oCount = 0;

    for (const item of row) {
      switch (item) {
        case 'X':
          xCount++;
          break;

        case 'O':
          oCount++;
          break;
      }
    }

    if (xCount === 3) {
      return { winner: 'x', index };
    } else if (oCount === 3) {
      return { winner: 'o', index };
    } 
  }
}

function checkDiagonalWinner(board) {
  let xCount = 0;
  let oCount = 0;

  for (let i = 0; i < 3; i++) {
    switch (board[i][i]) {
      case 'X':
        xCount++;
        break;

      case 'O':
        oCount++;
        break;
    }
  }

  if (xCount === 3) {
    return 'x';
  } else if (oCount === 3) {
    return 'o';
  } 
}

function checkReverseDiagonalWinner(board) {
  if (board[0][2] === 'X' &&
      board[1][1] === 'X' &&
      board[2][0] === 'X') {
    return 'x';
  }

  if (board[0][2] === 'O' &&
      board[1][1] === 'O' &&
      board[2][0] === 'O') {
    return 'o';
  }
}

function transpose(board) {
  const result = [ [], [], [] ];

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      result[column][row] = board[row][column];
    }
  }

  return result;
}

export function checkWinner(board) {
  const rowWinner = checkRowWinner(board);
  if (rowWinner) {
    return `tictactoe-winner tictactoe-winner-row tictactoe-winner-row-${rowWinner.index} tictactoe-winner-${rowWinner.winner}`;
  }

  const colWinner = checkRowWinner(transpose(board));
  if (colWinner) {
    return `tictactoe-winner tictactoe-winner-column tictactoe-winner-column-${colWinner.index} tictactoe-winner-${colWinner.winner}`;
  }

  const diagonalWinner = checkDiagonalWinner(board);
  if (diagonalWinner) {
    return `tictactoe-winner tictactoe-winner-diagonal tictactoe-winner-${diagonalWinner}`;
  }

  const reverseDiagonalWinner = checkReverseDiagonalWinner(board);
  if (reverseDiagonalWinner) {
    return `tictactoe-winner tictactoe-winner-reverse-diagonal tictactoe-winner-${reverseDiagonalWinner}`;
  }

  return '';
}

