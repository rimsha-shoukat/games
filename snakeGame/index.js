const play_ground = document.querySelector(".ground");
const box_height = 30;
const box_width = 30;
const rows = Math.floor(play_ground.clientHeight / box_height);
const cols = Math.floor(play_ground.clientWidth / box_width);
const ground_map = {};
let level = "M";
let speed = 300;
let food = { x: 5, y: 7 };
let direction = "right";
let gameInterval;
let food_container;
let playing_state = document.querySelector(".playing-stage");
let initial_state = document.querySelector(".initial-stage");
let game_over = document.querySelector(".game-over");
let restart = document.querySelector(".restart-game");
let score = 0;
let top_score = localStorage.getItem("score") || "00";

// changing game level/speed/color
function changeLevel(mode) {
    if (food_container) {
        food_container.classList.remove("snake-food-easy", "snake-food-medium", "snake-food-hard");
    }
    if (mode == "easy") {
        level = "E";
        speed = 400;
        document.querySelector(".game-state").textContent = "Easy";
    } else if (mode == "medium") {
        level = "M";
        speed = 300;
        document.querySelector(".game-state").textContent = "Medium";
    } else if (mode == "hard") {
        level = "H";
        speed = 200;
        document.querySelector(".game-state").textContent = "Advance";
    }
    if (food_container) {
        if (level == "E") food_container.classList.add("snake-food-easy");
        else if (level == "M") food_container.classList.add("snake-food-medium");
        else if (level == "H") food_container.classList.add("snake-food-hard");
    }
    renderSnake();
}

// play ground grid
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        const box = document.createElement("div");
        box.classList.add("box");
        play_ground.appendChild(box);
        ground_map[`${x}-${y}`] = box;
    }
}

let snake = [{ x: 3, y: 6 }];

// fill snake
function renderSnake() {
    Object.values(ground_map).forEach(box => {
        box.classList.remove(
            "snake-head-easy", "snake-easy",
            "snake-head-medium", "snake-medium",
            "snake-head-hard", "snake-hard"
        );
    });
    snake.forEach((segment, index) => {
        const box = ground_map[`${segment.x}-${segment.y}`];
        if (level == "E") {
            box.classList.add(index === 0 ? "snake-head-easy" : "snake-easy");
        } else if (level == "M") {
            box.classList.add(index === 0 ? "snake-head-medium" : "snake-medium");
        } else if (level == "H") {
            box.classList.add(index === 0 ? "snake-head-hard" : "snake-hard");
        }
    }
    )
}
renderSnake();

// move the snake update head remove tail
function moveSnake() {
    const oldHead = snake[0];
    let newHead;
    if (direction === "right") {
        newHead = { x: oldHead.x + 1, y: oldHead.y };
    } else if (direction === "left") {
        newHead = { x: oldHead.x - 1, y: oldHead.y };
    } else if (direction === "up") {
        newHead = { x: oldHead.x, y: oldHead.y - 1 };
    } else if (direction === "down") {
        newHead = { x: oldHead.x, y: oldHead.y + 1 };
    }
    // if snake goes out of ground end the game
    if (newHead.x >= cols || newHead.y >= rows || newHead.x < 0 || newHead.y < 0) {
        clearInterval(gameInterval);
        game_over.style.display = "flex";
        return;
    }
    snake.unshift(newHead);

    // if snake consume food increase snake length and update food/score
    if (oldHead.x == food.x && oldHead.y == food.y) {
        score += 10;
        document.querySelectorAll(".score").forEach(i => i.textContent = score);
        food_container.classList.remove("snake-food-easy", "snake-food-medium", "snake-food-hard");
        generateFood();
    } else {
        snake.pop();
    }
    renderSnake();
}

// generate random food for snake inside ground
function generateFood() {
    food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    food_container = ground_map[`${food.x}-${food.y}`];
    if (level == "E") {
        food_container.classList.add("snake-food-easy");
    } else if (level == "M") {
        food_container.classList.add("snake-food-medium");
    } else if (level == "H") {
        food_container.classList.add("snake-food-hard");
    }
}

// restart game on click
const startBtn = document.querySelector(".start-game");
startBtn.addEventListener("click", () => {
    // update helper buttons
    initial_state.style.display = "none";
    playing_state.style.display = "block";
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        moveSnake();
    }, speed);
})

generateFood();

// initial state of helper buttons
playing_state.style.display = "none";
game_over.style.display = "none";
document.querySelector(".top-score").textContent = top_score;

// control snake with keyboard
addEventListener("keydown", (event) => {
    if ((event.key == "ArrowUp") && (direction != "down")) { direction = "up"; }
    else if ((event.key == "ArrowDown") && (direction != "up")) { direction = "down"; }
    else if ((event.key == "ArrowRight") && (direction != "left")) { direction = "right"; }
    else if ((event.key == "ArrowLeft") && (direction != "right")) { direction = "left"; }
});

// control buttons in ui
document.querySelector(".up").addEventListener("click", () => {
    if (direction != "down") { direction = "up"; }
})
document.querySelector(".down").addEventListener("click", () => {
    if (direction != "up") { direction = "down"; }
})
document.querySelector(".right").addEventListener("click", () => {
    if (direction != "left") { direction = "right"; }
})
document.querySelector(".left").addEventListener("click", () => {
    if (direction != "right") { direction = "left"; }
})

// restart game
restart.addEventListener("click", () => {
    playing_state.style.display = "none";
    game_over.style.display = "none";
    initial_state.style.display = "block";
    snake = [{ x: 3, y: 6 }];
    renderSnake();
    food_container.classList.remove("snake-food-easy", "snake-food-medium", "snake-food-hard");
    generateFood();
    direction = "right";
    if (score > top_score) {
        localStorage.setItem("score", score);
        document.querySelector(".top-score").textContent = score;
    }
    score = 0;
    document.querySelectorAll(".score").forEach(i => i.textContent = "00");
})

// pause/resume the game state 
let handler = document.querySelector(".pause-game");
handler.addEventListener("click", () => {
    if (handler.textContent === "Pause") {
        clearInterval(gameInterval);
        handler.textContent = "Resume";
    } else {
        gameInterval = setInterval(moveSnake, speed);
        handler.textContent = "Pause";
    }
});