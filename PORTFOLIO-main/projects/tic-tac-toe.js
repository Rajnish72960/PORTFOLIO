const boardElement = document.querySelector('#game-board');
const statusElement = document.querySelector('#game-status');
const cells = Array.from(boardElement.querySelectorAll('[data-cell]'));
const scoreXElement = document.querySelector('#score-x');
const scoreOElement = document.querySelector('#score-o');

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let board = ['', '', '', '', '', '', '', '', ''];
let activePlayer = 'X';
let roundOver = false;
let scoreX = 0;
let scoreO = 0;

function getWinningLine() {
  for (const line of winningLines) {
    const first = board[line[0]];
    if (first && first === board[line[1]] && first === board[line[2]]) {
      return line;
    }
  }
  return null;
}

function renderBoard() {
  const winningLine = getWinningLine();

  cells.forEach((cell, index) => {
    const mark = board[index];
    cell.textContent = mark;
    cell.disabled = roundOver || mark !== '';
    cell.classList.toggle('o', mark === 'O');
    cell.classList.toggle('winner', winningLine !== null && winningLine.includes(index));
    cell.setAttribute('aria-label', mark ? `${mark} in cell ${index + 1}` : `Empty cell ${index + 1}`);
  });

  scoreXElement.textContent = String(scoreX);
  scoreOElement.textContent = String(scoreO);
}

function playCell(index) {
  if (roundOver || board[index] !== '') return;

  board[index] = activePlayer;
  const winningLine = getWinningLine();

  if (winningLine) {
    roundOver = true;
    if (activePlayer === 'X') scoreX += 1;
    else scoreO += 1;
    statusElement.textContent = `Player ${activePlayer} wins this round!`;
  } else if (board.every((mark) => mark !== '')) {
    roundOver = true;
    statusElement.textContent = "It's a draw. Start a new round to play again.";
  } else {
    activePlayer = activePlayer === 'X' ? 'O' : 'X';
    statusElement.textContent = `Player ${activePlayer}'s turn`;
  }

  renderBoard();
}

function startNewRound() {
  board = ['', '', '', '', '', '', '', '', ''];
  activePlayer = 'X';
  roundOver = false;
  statusElement.textContent = 'Player X goes first';
  renderBoard();
}

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => playCell(index));
});

document.querySelector('#new-round').addEventListener('click', startNewRound);
document.querySelector('#reset-scores').addEventListener('click', () => {
  scoreX = 0;
  scoreO = 0;
  startNewRound();
});

renderBoard();
