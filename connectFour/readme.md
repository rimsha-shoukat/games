# Connect Four 🔴🟡

A classic two-player Connect Four game built with plain **HTML, CSS, and JavaScript** — no frameworks, no libraries.

🎮 **[Play Live](https://rimsha-shoukat.github.io/games/connectFour/)**
📖 **[Step-by-step Build Tutorial](https://rimsha-shoukat.github.io/games/connectFour/index1.html)**

## About

Players take turns dropping colored discs into a 7×6 grid. The first to connect **four discs in a row** — horizontally, vertically, or diagonally — wins. Includes score tracking across rounds and a full win-highlight animation.

## Features

- 7×6 interactive grid, built dynamically via JavaScript
- Turn-based two-player logic with live status indicator
- Win detection in all 4 directions (horizontal, vertical, both diagonals)
- Winning sequence highlight animation
- Score and round tracking with reset controls
- Zero dependencies — pure vanilla JS

## Tech Stack

| Layer | Tech |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom properties / CSS variables) |
| Logic | Vanilla JavaScript (ES6) |

## Project Structure

```
connectFour/
├── index.html      # The actual playable game
├── index1.html      # Step-by-step tutorial explaining the build
└── index.js         # Game logic (grid, drop, win detection)
```

## Run Locally

```bash
git clone https://github.com/rimsha-shoukat/games.git
cd games/connectFour
```

Then just open `index.html` in your browser — no build step, no install.

## How It Works (short version)

- Game state lives in a 2D array `grid[row][col]` — the DOM is just a reflection of it.
- `drop(col)` finds the lowest empty row in a column, places the disc, then checks for a win.
- `checkWin(row, col)` scans 4 directions from the last move to detect a connect-four.
- Full breakdown with diagrams and code walkthrough is in the [tutorial page](https://rimsha-shoukat.github.io/games/connectFour/index1.html).

## License

MIT — free to use, modify, and learn from.

Made by [Rimsha Shoukat](https://github.com/rimsha-shoukat)
