const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const SCORE_ELEMENT = document.getElementById('score');

const colors = [
    null,
    '#FF5733', // I
    '#33FF57', // J
    '#3357FF', // L
    '#F9FF33', // O
    '#FF33A8', // S
    '#33FFF2', // T
    '#FF33B2', // Z
];

const pieces = [
    [[1, 1, 1, 1]], // I
    [[2, 0, 0], [2, 2, 2]], // J
    [[0, 0, 3], [3, 3, 3]], // L
    [[4, 4], [4, 4]], // O
    [[0, 5, 5], [5, 5, 0]], // S
    [[0, 6, 0], [6, 6, 6]], // T
    [[7, 7, 0], [0, 7, 7]], // Z
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentPiece;
let currentPosition;
let score = 0;

function init() {
    document.addEventListener('keydown', handleKeyPress);
    generateNewPiece();
    draw();
    setInterval(update, 1000);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece();
    SCORE_ELEMENT.innerText = `Score: ${score}`;
}

function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const block = board[row][col];
            if (block !== 0) {
                ctx.fillStyle = colors[block];
                ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawPiece() {
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col] !== 0) {
                ctx.fillStyle = colors[currentPiece[row][col]];
                ctx.fillRect((currentPosition.x + col) * BLOCK_SIZE, (currentPosition.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#fff';
                ctx.strokeRect((currentPosition.x + col) * BLOCK_SIZE, (currentPosition.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function generateNewPiece() {
    const randomIndex = Math.floor(Math.random() * pieces.length);
    currentPiece = pieces[randomIndex];
    currentPosition = { x: Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2), y: 0 };

    if (!canPlacePiece()) {
        alert("Game Over!");
        document.location.reload();
    }
}

function canPlacePiece() {
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col] !== 0) {
                const boardRow = currentPosition.y + row;
                const boardCol = currentPosition.x + col;
                if (boardRow < 0 || boardCol < 0 || boardCol >= COLS || boardRow >= ROWS || board[boardRow][boardCol] !== 0) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placePiece() {
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col] !== 0) {
                board[currentPosition.y + row][currentPosition.x + col] = currentPiece[row][col];
            }
        }
    }
    clearLines();
    generateNewPiece();
}

function clearLines() {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every((block) => block !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            score += 10;
        }
    }
}

function update() {
    currentPosition.y++;
    if (!canPlacePiece()) {
        currentPosition.y--;
        placePiece();
    }
    draw();
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowLeft':
            currentPosition.x--;
            if (!canPlacePiece()) currentPosition.x++;
            break;
        case 'ArrowRight':
            currentPosition.x++;
            if (!canPlacePiece()) currentPosition.x--;
            break;
        case 'ArrowDown':
            currentPosition.y++;
            if (!canPlacePiece()) {
                currentPosition.y--;
                placePiece();
            }
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
    }
}

function rotatePiece() {
    const rotatedPiece = currentPiece[0].map((_, index) => currentPiece.map(row => row[index])).reverse();
    currentPiece = rotatedPiece;
    if (!canPlacePiece()) {
        currentPiece = rotatedPiece.map((_, index) => currentPiece[0].map((_, j) => currentPiece[j][index])); // Undo rotation
    }
}

init();
