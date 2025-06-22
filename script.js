const board = Array(9).fill(null);
const boardEl = document.getElementById('board');
const status = document.getElementById('status');
let gameOver = false;

function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.innerText = val || '';
    cell.onclick = () => makeMove(i);
    boardEl.appendChild(cell);
  });
}

function makeMove(i) {
  if (board[i] || gameOver) return;
  board[i] = 'X';
  if (checkWinner('X')) return endGame('You win!');
  if (board.every(cell => cell)) return endGame('Draw!');
  aiMove();
}

function aiMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  board[move] = 'O';
  if (checkWinner('O')) return endGame('AI wins!');
  if (board.every(cell => cell)) return endGame('Draw!');
  renderBoard();
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner('O', board)) return 1;
  if (checkWinner('X', board)) return -1;
  if (board.every(cell => cell)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function checkWinner(player, tempBoard = board) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(combo => combo.every(i => tempBoard[i] === player));
}

function endGame(msg) {
  gameOver = true;
  status.innerText = msg;
  renderBoard();
}

function restartGame() {
  for (let i = 0; i < 9; i++) board[i] = null;
  gameOver = false;
  status.innerText = '';
  renderBoard();
}

renderBoard();
