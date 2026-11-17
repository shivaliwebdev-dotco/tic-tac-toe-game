
# Tiny Battle - Tic Tac Toe

## Overview

Tiny Battle is a fun and interactive Tic Tac Toe game where a player competes against a computer opponent.

The player uses X and the computer uses O. The computer follows a basic strategy to win, block the player's winning moves or choose an available cell.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser LocalStorage

## Features

1. Interactive 3x3 game board.
2. Player versus computer gameplay.
3. Computer winning and blocking strategy.
4. Random computer moves when no winning or blocking move is available.
5. Winning combination highlighting.
6. Win, lose and draw detection.
7. Play Again functionality.
8. Score tracking using LocalStorage.
9. Responsive mobile-friendly interface.
10. Short delay before the computer plays.

## Rules

1. The player plays as X.
2. The computer plays as O.
3. Players take turns placing their marks.
4. Three matching marks in a row, column or diagonal wins.
5. If all cells are filled without a winner, the game ends in a draw.

## How to Run

1. Download or clone the project.
2. Open the project folder in Visual Studio Code.
3. Make sure all four project files are in the same folder.
4. Open index.html in a browser.
5. Start playing!

## Implementation Details

The game board is represented using a JavaScript array containing nine positions.

The computer checks for a possible winning move first. If it cannot win, it checks whether it needs to block the player's winning move.

If neither situation occurs, it prefers the centre cell or chooses a random available cell.

The game checks all eight possible winning combinations after every move.

The scores are stored in browser LocalStorage so that they remain available after refreshing the page.

## Testing

- Test all three rows.
- Test all three columns.
- Test both diagonals.
- Check whether the computer blocks an immediate player win.
- Check whether the computer takes a winning move.
- Check draw detection.
- Try clicking occupied cells.
- Refresh the browser and check saved scores.
- Test the game on mobile screen sizes.
