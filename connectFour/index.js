const ROWS = 6, COLS = 7;
let grid, currentPlayer, gameOver, scores = [0, 0], round = 1;

function initGrid() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    currentPlayer = 1;
    gameOver = false;
    renderBoard();
    updateStatus();
    setArrows(true);
}

function renderBoard() {
    const pg = document.getElementById('playground');
    pg.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (grid[r][c] === 1) cell.classList.add('p1');
            if (grid[r][c] === 2) cell.classList.add('p2');
            cell.dataset.r = r;
            cell.dataset.c = c;
            pg.appendChild(cell);
        }
    }
}

function updateStatus(msg) {
    const dot = document.getElementById('statusDot');
    const txt = document.getElementById('statusText');
    dot.className = 'status-dot';
    if (msg) {
        dot.classList.add('neutral');
        txt.textContent = msg;
    } else {
        if (currentPlayer === 2) dot.classList.add('p2');
        txt.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function setArrows(enabled) {
    const da = document.getElementById('dropArrows');
    if (enabled) da.classList.remove('disabled');
    else da.classList.add('disabled');
}

function drop(col) {
    if (gameOver) return;
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r][col] === 0) { row = r; break; }
    }
    if (row === -1) return;

    grid[row][col] = currentPlayer;
    renderBoard();

    const win = checkWin(row, col);
    if (win) {
        scores[currentPlayer - 1]++;
        document.getElementById(`score${currentPlayer}`).textContent = scores[currentPlayer - 1];
        round++;
        document.getElementById('roundNum').textContent = round;
        highlightWin(win);
        updateStatus(`Player ${currentPlayer} wins!`);
        gameOver = true;
        setArrows(false);
    } else if (grid[0].every(v => v !== 0)) {
        updateStatus("It's a draw!");
        gameOver = true;
        setArrows(false);
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateStatus();
    }
}

function highlightWin(cells) {
    const pg = document.getElementById('playground');
    cells.forEach(([r, c]) => {
        pg.children[r * COLS + c].classList.add('win');
    });
}

function checkWin(row, col) {
    const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
    const p = currentPlayer;
    for (const [dr, dc] of dirs) {
        let seq = [[row, col]];
        for (let d = 1; d <= 3; d++) {
            const r = row + dr * d, c = col + dc * d;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && grid[r][c] === p) seq.push([r, c]);
            else break;
        }
        for (let d = 1; d <= 3; d++) {
            const r = row - dr * d, c = col - dc * d;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && grid[r][c] === p) seq.push([r, c]);
            else break;
        }
        if (seq.length >= 4) return seq.slice(0, 4);
    }
    return null;
}

function resetGame() { initGrid(); }

function resetScores() {
    scores = [0, 0];
    round = 1;
    document.getElementById('score1').textContent = 0;
    document.getElementById('score2').textContent = 0;
    document.getElementById('roundNum').textContent = 1;
    initGrid();
}

initGrid();