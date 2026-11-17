
// Get HTML elements

const cells = [...document.querySelectorAll(".cell")];

const turnStatus = document.getElementById("turn-status");

const resultPanel = document.getElementById("result-panel");

const resultTitle = document.getElementById("result-title");

const resultMessage = document.getElementById("result-message");

const resultEmoji = document.getElementById("result-emoji");

const playAgainButton = document.getElementById("play-again");

const resetScoreButton = document.getElementById("reset-score");

const roundNumber = document.getElementById("round-number");


// All possible winning combinations

const WIN_LINES = [

    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonals
    [0, 4, 8],
    [2, 4, 6]

];


// Game variables

const STORAGE_KEY = "tinyBattleScore";

let board = Array(9).fill("");

let gameOver = false;

let computerThinking = false;

let round = 1;

let score = loadScore();


// Load saved score from localStorage

function loadScore() {

    try {

        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

        if (
            saved &&
            ["player", "computer", "draws"].every(
                key =>
                    Number.isInteger(saved[key]) &&
                    saved[key] >= 0
            )
        ) {

            return saved;

        }

    } catch (error) {

        console.warn("Could not read saved score:", error);

    }

    return {
        player: 0,
        computer: 0,
        draws: 0
    };

}


// Save score

function saveScore() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(score)
        );

    } catch (error) {

        console.warn("Could not save score:", error);

    }

}


// Display scoreboard

function renderScore() {

    document.getElementById("player-score").textContent =
        score.player;

    document.getElementById("cpu-score").textContent =
        score.computer;

    document.getElementById("draw-score").textContent =
        score.draws;

}


// Display board

function renderBoard() {

    cells.forEach((cell, index) => {

        const mark = board[index];

        cell.textContent = mark;

        cell.className =
            "cell" + (mark ? ` ${mark.toLowerCase()}` : "");

        cell.disabled =
            gameOver ||
            computerThinking ||
            Boolean(mark);

        cell.setAttribute(
            "aria-label",
            mark
                ? `Cell ${index + 1}: ${mark}`
                : `Empty cell ${index + 1}`
        );

    });

}


// Check whether a player has won

function getWinningLine(state, mark) {

    return WIN_LINES.find(line =>

        line.every(index => state[index] === mark)

    ) || null;

}


// Find a move that wins or blocks

function findWinningMove(mark) {

    for (let index = 0; index < board.length; index++) {

        if (board[index]) continue;

        const testBoard = [...board];

        testBoard[index] = mark;

        if (getWinningLine(testBoard, mark)) {

            return index;

        }

    }

    return null;

}


// Computer strategy

function getComputerMove() {

    // Step 1: Computer tries to win

    const winningMove = findWinningMove("O");

    if (winningMove !== null) {

        return winningMove;

    }


    // Step 2: Computer blocks the player

    const blockingMove = findWinningMove("X");

    if (blockingMove !== null) {

        return blockingMove;

    }


    // Step 3: Prefer the centre cell

    if (!board[4]) {

        return 4;

    }


    // Step 4: Choose a random empty cell

    const freeCells = board

        .map((value, index) => value ? null : index)

        .filter(index => index !== null);


    return freeCells[
        Math.floor(Math.random() * freeCells.length)
    ];

}


// Update turn message

function setTurn(message, thinking = false) {

    turnStatus.innerHTML =
        `<span class="turn-dot"></span> ${message}`;

    turnStatus.classList.toggle(
        "thinking",
        thinking
    );

}


// End game

function finishGame(winner, line = null) {

    gameOver = true;

    computerThinking = false;


    // Highlight winning cells

    if (line) {

        line.forEach(index => {

            cells[index].classList.add("winner");

        });

    }


    // Player wins

    if (winner === "X") {

        score.player++;

        resultEmoji.textContent = "🎉";

        resultTitle.textContent = "You win!";

        resultMessage.textContent =
            "Look at you, tic-tac-toe champion!";

        setTurn("You nailed it!");

    }


    // Computer wins

    else if (winner === "O") {

        score.computer++;

        resultEmoji.textContent = "🤖";

        resultTitle.textContent = "Computer wins!";

        resultMessage.textContent =
            "The bot got clever this time. Rematch?";

        setTurn("Round over");

    }


    // Draw

    else {

        score.draws++;

        resultEmoji.textContent = "🤝";

        resultTitle.textContent = "It's a draw!";

        resultMessage.textContent =
            "A perfectly matched battle.";

        setTurn("Round over");

    }


    // Show result

    resultPanel.hidden = false;


    // Save and update scores

    saveScore();

    renderScore();

    renderBoard();

}


// Check win or draw after every move

function checkGameState() {

    const playerLine = getWinningLine(board, "X");

    if (playerLine) {

        finishGame("X", playerLine);

        return true;

    }


    const computerLine = getWinningLine(board, "O");

    if (computerLine) {

        finishGame("O", computerLine);

        return true;

    }


    // Check draw

    if (board.every(Boolean)) {

        finishGame("draw");

        return true;

    }


    return false;

}


// Player makes a move

function playerMove(index) {

    if (
        gameOver ||
        computerThinking ||
        board[index]
    ) {

        return;

    }


    // Place player's X

    board[index] = "X";

    renderBoard();


    // Check if player won

    if (checkGameState()) {

        return;

    }


    // Computer's turn

    computerThinking = true;

    setTurn("Computer is thinking…", true);

    renderBoard();


    // Delay before computer moves

    window.setTimeout(() => {

        const move = getComputerMove();

        if (move !== null && !board[move]) {

            board[move] = "O";

        }

        computerThinking = false;

        renderBoard();


        // Check if computer won

        if (!checkGameState()) {

            setTurn("Your turn");

        }

    }, 650);

}


// Start another round

function startNextRound() {

    board = Array(9).fill("");

    gameOver = false;

    computerThinking = false;

    round++;


    roundNumber.textContent =
        String(round).padStart(2, "0");


    resultPanel.hidden = true;

    setTurn("Your turn");

    renderBoard();

}


// Add click event to each cell

cells.forEach((cell, index) => {

    cell.addEventListener("click", () => {

        playerMove(index);

    });

});


// Play again button

playAgainButton.addEventListener("click", () => {

    startNextRound();

});


// Reset scoreboard button

resetScoreButton.addEventListener("click", () => {

    score = {
        player: 0,
        computer: 0,
        draws: 0
    };

    saveScore();

    renderScore();

    startNextRound();

});


// Start game

renderScore();

renderBoard();
