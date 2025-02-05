// Constants for the game configuration
const rows = 10;
const cols = 10;
const totalBombs = 10;

// Game state variables
let gameBoard = [];
let gameOver = false;

// DOM elements
const gameBoardEl = document.getElementById('game-board');
const statusMessageEl = document.getElementById('status-message');

/**
 * Initializes the game board and starts a new game.
 */
function createBoard() {
  gameBoard = [];
  for (let row = 0; row < rows; row++) {
    const rowArr = [];
    for (let col = 0; col < cols; col++) {
      rowArr.push({
        hasBomb: false,
        revealed: false,
        flagged: false,
        adjacentBombs: 0,
      });
    }
    gameBoard.push(rowArr);
  }
  placeBombs();
  calculateAdjacentBombs();
}

/**
 * Randomly places bombs on the game board.
 */
function placeBombs() {
  let bombsPlaced = 0;
  while (bombsPlaced < totalBombs) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!gameBoard[row][col].hasBomb) {
      gameBoard[row][col].hasBomb = true;
      bombsPlaced++;
    }
  }
}

/**
 * Calculates the number of adjacent bombs for each cell on the game board.
 */
function calculateAdjacentBombs() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (gameBoard[row][col].hasBomb) continue;
      let bombCount = 0;
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const newRow = row + r;
          const newCol = col + c;
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            if (gameBoard[newRow][newCol].hasBomb) {
              bombCount++;
            }
          }
        }
      }
      gameBoard[row][col].adjacentBombs = bombCount;
    }
  }
}

/**
 * Reveals a cell on the game board.
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 */
function revealCell(row, col) {
  if (gameBoard[row][col].revealed || gameBoard[row][col].flagged || gameOver) return;

  gameBoard[row][col].revealed = true;
  const cell = document.getElementById(`cell-${row}-${col}`);
  if (gameBoard[row][col].hasBomb) {
    cell.innerHTML = `<i class="fas fa-bomb bomb"></i>`;
    gameOver = true;
    statusMessageEl.textContent = 'Game Over!';
  } else {
    if (gameBoard[row][col].adjacentBombs > 0) {
      cell.textContent = gameBoard[row][col].adjacentBombs;
    }
    cell.classList.add('clicked');
  }
}

/**
 * Flags or unflags a cell on the game board.
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 */
function flagCell(row, col) {
  if (gameBoard[row][col].revealed || gameOver) return;
  const cell = document.getElementById(`cell-${row}-${col}`);
  gameBoard[row][col].flagged = !gameBoard[row][col].flagged;
  if (gameBoard[row][col].flagged) {
    cell.classList.add('flagged');
    cell.innerHTML = `<i class="fas fa-flag"></i>`;
  } else {
    cell.classList.remove('flagged');
    cell.innerHTML = '';
  }
}

/**
 * Creates a cell element and adds it to the game board.
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 */
function createCell(row, col) {
  const cell = document.createElement('div');
  cell.classList.add('grid-cell');
  cell.id = `cell-${row}-${col}`;
  cell.addEventListener('click', () => revealCell(row, col));
  cell.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    flagCell(row, col);
  });
  gameBoardEl.appendChild(cell);
}

/**
 * Renders the game board by creating cell elements.
 */
function renderBoard() {
  gameBoardEl.innerHTML = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      createCell(row, col);
    }
  }
}

/**
 * Resets the game to its initial state.
 */
function resetGame() {
  gameOver = false;
  statusMessageEl.textContent = '';
  createBoard();
  renderBoard();
}

// Start a new game when the script is loaded
resetGame();
