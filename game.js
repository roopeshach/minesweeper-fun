// Constants for the game configuration
let rows = 10;
let cols = 10;
const totalBombs = 10;
let gridSize = 30; // Default grid size

// Game state variables
let gameBoard = [];
let gameOver = false;
let score = 0;
let highestScore = localStorage.getItem('highestScore') || 0;

// DOM elements
const gameBoardEl = document.getElementById('game-board');
const statusMessageEl = document.getElementById('status-message');
const scoreEl = document.getElementById('score');
const highestScoreEl = document.getElementById('highest-score');

/**
 * Initializes the game board and starts a new game.
 */
function createBoard() {
  gameBoard = [];
  score = 0;
  updateScore();
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
    statusMessageEl.textContent = `Game Over! Final Score: ${score}`;
    updateHighestScore();
  } else {
    if (gameBoard[row][col].adjacentBombs > 0) {
      cell.textContent = gameBoard[row][col].adjacentBombs;
    } else {
      cell.textContent = '0';
    }
    cell.classList.add('clicked');
    score++;
    updateScore();
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
  cell.style.width = `${gridSize}px`;
  cell.style.height = `${gridSize}px`;
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
  gameBoardEl.style.gridTemplateColumns = `repeat(${cols}, ${gridSize}px)`;
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

/**
 * Updates the displayed score.
 */
function updateScore() {
  scoreEl.textContent = `Score: ${score}`;
}

/**
 * Updates the highest score in local storage.
 */
function updateHighestScore() {
  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem('highestScore', highestScore);
    highestScoreEl.textContent = `Highest Score: ${highestScore}`;
  }
}

/**
 * Updates the grid size based on the range slider value.
 * @param {number} size - The new size of the grid cells.
 */
function updateGridSize(size) {
  gridSize = size;
  renderBoard();
}

/**
 * Sets the grid count based on the selected button.
 * @param {number} newRows - The number of rows.
 * @param {number} newCols - The number of columns.
 */
function setGridCount(newRows, newCols) {
  rows = newRows;
  cols = newCols;
  resetGame();
}

// Start a new game when the script is loaded
resetGame();
highestScoreEl.textContent = `Highest Score: ${highestScore}`;