const friendBtn = document.querySelector(".mode-friend");
const botBtn = document.querySelector(".mode-bot");
const modeDiv = document.querySelector(".mode");
const boardGround = document.querySelector(".board-ground");
const scoreBtn = document.querySelector(".score-buttons");
const replayBtn = document.querySelector(".replay");

const player0ScoreEl = document.querySelector(".player0-score");
const player1ScoreEl = document.querySelector(".player1-score");
const cubes = document.querySelectorAll(".cube");

let playerX = true;
let vsBot = false;
let gameOver = false;
let botThinking = false;
let botTimeout = null;

let xScore = 0;
let oScore = 0;

let cubeList = Array(9).fill(null);

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function startGame(isBotMode) {
  vsBot = isBotMode;
  modeDiv.style.display = "none";
  boardGround.classList.add("showGrids");
  scoreBtn.classList.add("showScores");
}

friendBtn.addEventListener("click", () => startGame(false));
botBtn.addEventListener("click", () => startGame(true));

function checkWin(mark) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (cubeList[a] === mark && cubeList[b] === mark && cubeList[c] === mark) {
      return pattern;
    }
  }
  return null;
}

function makeMove(index, mark) {
  cubeList[index] = mark;
  cubes[index].textContent = mark;
  cubes[index].style.color = mark === "X" ? "var(--x-mark)" : "var(--o-mark)";

  const winCombo = checkWin(mark);
  if (winCombo) {
    gameOver = true;
    winCombo.forEach((i) => {
      cubes[i].style.color = "blue";
    });

    if (mark === "X") {
      xScore++;
      player0ScoreEl.textContent = xScore;
    } else {
      oScore++;
      player1ScoreEl.textContent = oScore;
    }

    replayBtn.classList.add("showReplay");
    return true;
  }

  if (!cubeList.includes(null)) {
    gameOver = true;
    replayBtn.classList.add("showReplay");
    return true;
  }

  return false;
}

function getBotMove() {
  const emptyIndices = cubeList
    .map((val, idx) => (val === null ? idx : null))
    .filter((idx) => idx !== null);

  for (let idx of emptyIndices) {
    cubeList[idx] = "O";
    if (checkWin("O")) {
      cubeList[idx] = null;
      return idx;
    }
    cubeList[idx] = null;
  }

  for (let idx of emptyIndices) {
    cubeList[idx] = "X";
    if (checkWin("X")) {
      cubeList[idx] = null;
      return idx;
    }
    cubeList[idx] = null;
  }

  if (emptyIndices.includes(4)) return 4;

  const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  return emptyIndices[randomIndex];
}

cubes.forEach((cube) => {
  cube.addEventListener("click", () => {
    const id = Number(cube.getAttribute("id"));

    if (cubeList[id] !== null || gameOver || botThinking) {
      return;
    }

    if (vsBot) {
      const gameEnded = makeMove(id, "X");
      if (!gameEnded) {
        botThinking = true;
        botTimeout = setTimeout(() => {
          const botIndex = getBotMove();
          makeMove(botIndex, "O");
          botThinking = false;
        }, 400);
      }
    } else {
      const currentMark = playerX ? "X" : "O";
      const gameEnded = makeMove(id, currentMark);
      if (!gameEnded) {
        playerX = !playerX;
      }
    }
  });
});

replayBtn.addEventListener("click", () => {
  clearTimeout(botTimeout);
  replayBtn.classList.remove("showReplay");
  cubeList = Array(9).fill(null);
  gameOver = false;
  botThinking = false;
  playerX = true;

  cubes.forEach((cube) => {
    cube.textContent = "";
    cube.style.scale = "1";
  });
});