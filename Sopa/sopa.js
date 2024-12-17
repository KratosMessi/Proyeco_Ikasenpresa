const gridSize = 10; // Tamaño del tablero
const words = ["CUM", "CSS", "JAVASCRIPT", "CODIGO", "DISEÑO", "WEB"]; // Palabras a buscar
const grid = document.getElementById('grid');
const wordList = document.getElementById('word-list');

// Genera el tablero
const board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
function populateBoard() {
    // Coloca las palabras en el tablero
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = Math.random() > 0.5; // true = horizontal, false = vertical
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            
            if (direction) {
                if (col + word.length <= gridSize && checkSpace(word, row, col, direction)) {
                    for (let i = 0; i < word.length; i++) {
                        board[row][col + i] = word[i];
                    }
                    placed = true;
                }
            } else {
                if (row + word.length <= gridSize && checkSpace(word, row, col, direction)) {
                    for (let i = 0; i < word.length; i++) {
                        board[row + i][col] = word[i];
                    }
                    placed = true;
                }
            }
        }
    });

    // Rellena los espacios vacíos con letras aleatorias
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (!board[row][col]) {
                board[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    renderBoard();
}

// Verifica si hay espacio para una palabra
function checkSpace(word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        const currentRow = direction ? row : row + i;
        const currentCol = direction ? col + i : col;
        if (board[currentRow][currentCol]) return false;
    }
    return true;
}

// Renderiza el tablero en el DOM
function renderBoard() {
    grid.innerHTML = '';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const div = document.createElement('div');
            div.className = 'cell';
            div.textContent = cell;
            div.dataset.row = rowIndex;
            div.dataset.col = colIndex;
            div.addEventListener('click', selectCell);
            grid.appendChild(div);
        });
    });

    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        li.id = `word-${word}`;
        wordList.appendChild(li);
    });
}

// Maneja la selección de celdas
let selectedCells = [];
function selectCell(e) {
    const cell = e.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (cell.classList.contains('selected')) {
        cell.classList.remove('selected');
        selectedCells = selectedCells.filter(c => !(c.row === row && c.col === col));
    } else {
        cell.classList.add('selected');
        selectedCells.push({ row, col, letter: cell.textContent });
    }

    checkWord();
}

// Verifica si una palabra ha sido encontrada
function checkWord() {
    const selectedWord = selectedCells.map(c => c.letter).join('');
    if (words.includes(selectedWord)) {
        document.getElementById(`word-${selectedWord}`).classList.add('found');
        selectedCells.forEach(cell => {
            const cellDiv = document.querySelector(`.cell[data-row="${cell.row}"][data-col="${cell.col}"]`);
            cellDiv.classList.remove('selected');
            cellDiv.style.backgroundColor = 'green';
        });
        selectedCells = [];
    }
}

populateBoard();
