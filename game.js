//Explanation

//	1.	Initialization:
//	•	Canvas and Context: Get references to the canvas and its 2D context for drawing.
//	•	HTML Elements: Get references to various HTML elements for displaying game over screen, score, and high scores.
//	2.	Game Variables:
//	•	Declare variables to hold the game state, such as player, defenders, score, difficulty, intervals, and key press states.
//	3.	Start Game Function (startGame):
//	•	Initializes the game by creating the player and defenders, setting initial values for score, difficulty, and intervals, and hiding the game over and high scores screens.
//	4.	Create Defenders Function (createDefenders):
//	•	Creates a specified number of defenders, ensuring each defender is placed in a valid position that does not overlap with other defenders.
//	5.	Check Collision Function (checkCollision):
//	•	Checks if any defender occupies the same position as the player, indicating a collision.
//	6.	Save High Score Function (saveHighScore):
//	•	Saves the player’s score to localStorage, sorts the high scores, and keeps only the top 10 scores.
//	7.	Display High Scores Function (displayHighScores):
//	•	Retrieves high scores from localStorage and displays them on the high scores screen.
//	8.	Tick Function (tick):
//	•	Updates the game state, including defender movements, player input handling, collision checking, and score updating. Called at each iteration of the game loop.
//	9.	Game Loop Function (gameLoop):
//	•	Main game loop that continuously updates the game state and renders the game on the canvas. Calls the tick function and schedules the next frame using requestAnimationFrame.
//	10.	Start Game:
//	•	Calls startGame to initialize and start the game.

// Get references to HTML elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverDiv = document.getElementById('game-over');
const scoreDisplay = document.getElementById('score');
const highScoresDiv = document.getElementById('high-scores');
const scoreList = document.getElementById('score-list');
const nameInput = document.getElementById('name');

// Game variables
let player, defenders, score, difficulty, moveTowardPlayerChance, currentInterval;
let lastMoveTimes = { left: 0, right: 0, up: 0, down: 0 };
let lastUpdateTime = Date.now();
let gameOver = false;
let keysPressed = {};

// Function to start the game
function startGame() {
    player = new Player(); // Initialize the player
    player.lives = STARTING_LIVES; // Set the starting lives
    defenders = createDefenders(INITIAL_DEFENDERS); // Create initial defenders
    score = 0; // Initialize the score
    difficulty = 1; // Set the initial difficulty
    moveTowardPlayerChance = INITIAL_MOVE_TOWARD_PLAYER_CHANCE; // Set the initial move toward player chance
    currentInterval = BASE_INTERVAL; // Set the initial interval
    lastMoveTimes = { left: 0, right: 0, up: 0, down: 0 }; // Reset last move times
    lastUpdateTime = Date.now(); // Reset the last update time
    gameOver = false; // Set game over to false
    gameOverDiv.style.display = 'none'; // Hide the game over screen
    highScoresDiv.style.display = 'none'; // Hide the high scores screen
    requestAnimationFrame(gameLoop); // Start the game loop
}

// Function to create defenders
function createDefenders(count) {
    const positions = new Set(); // Create a set to track occupied positions
    const defenders = []; // Create an array to hold defenders

    // Loop to create the specified number of defenders
    for (let i = 0; i < count; i++) {
        let defender;

        // Ensure each defender is placed in a valid position
        do {
            defender = new Defender();
        } while (!defender.isValidPosition(positions, player.position));

        positions.add(defender.position.toString()); // Add the position to the set of occupied positions
        defenders.push(defender); // Add the defender to the array
    }

    return defenders; // Return the array of defenders
}

// Function to check for collisions between the player and defenders
function checkCollision() {
    return defenders.some(def => def.position.toString() === player.position.toString());
}

// Function to save high scores to localStorage
function saveHighScore() {
    const name = nameInput.value.trim(); // Get the player's name from the input field

    if (name === "") return; // If the name is empty, do nothing

    const highScores = JSON.parse(localStorage.getItem('highScores')) || []; // Get existing high scores from localStorage
    highScores.push({ name, score }); // Add the new score
    highScores.sort((a, b) => b.score - a.score); // Sort scores in descending order
    highScores.splice(10); // Keep only the top 10 scores

    localStorage.setItem('highScores', JSON.stringify(highScores)); // Save the updated high scores to localStorage
    displayHighScores(); // Display the updated high scores
}

// Function to display high scores
function displayHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || []; // Get high scores from localStorage
    scoreList.innerHTML = highScores.map(scoreEntry => `<li>${scoreEntry.name}: ${scoreEntry.score}</li>`).join(''); // Update the score list
    highScoresDiv.style.display = 'flex'; // Show the high scores screen
}

// Tick function to handle game updates
function tick() {
    const now = Date.now(); // Get the current time

    // Update defenders if enough time has passed since the last update
    if (now - lastUpdateTime >= currentInterval) {
        updateDefenders(defenders, player, moveTowardPlayerChance);
        lastUpdateTime = now;
    }

    handleInput(player, keysPressed, lastMoveTimes); // Handle player input

    // Check for collisions between the player and defenders
    if (checkCollision()) {
        player.lives -= 1; // Decrease the player's lives

        // If the player has no lives left, end the game
        if (player.lives <= 0) {
            gameOver = true;
            gameOverDiv.style.display = 'flex';
            scoreDisplay.textContent = `Score: ${score}`;
            displayHighScores();
            return;
        }

        player.position = [0, Math.floor(GRID_HEIGHT / 2)]; // Reset the player's position
    }

    // Check if the player has reached the goal
    if (player.position[0] === GRID_WIDTH - 1) {
        score += 1; // Increase the score
        player.position = [0, Math.floor(GRID_HEIGHT / 2)]; // Reset the player's position
        defenders = createDefenders(defenders.length); // Reset defenders

        // Increase difficulty every two scores
        if (score % 2 === 0) increaseDifficulty();
    }
}

// Game loop function
function gameLoop() {
    if (gameOver) return; // If the game is over, stop the game loop

    tick(); // Perform a game tick

    // Clear the canvas
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx); // Draw the grid
    player.draw(ctx); // Draw the player
    defenders.forEach(defender => defender.draw(ctx)); // Draw the defenders

    // Display the score and lives
    drawText(ctx, `Score: ${score}`, 10, 20, 16);
    drawText(ctx, `Lives: ${player.lives}`, 10, 40, 16);

    requestAnimationFrame(gameLoop); // Request the next frame
}

// Start the game
startGame();