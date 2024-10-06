// main.js

// Configuration settings for the game
const config = {
    type: Phaser.AUTO,
    width: 720, // Adjusted for larger grid
    height: 400,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

// Game variables
let player;
let defenders;
let cursors;
let wasdKeys;
let pauseKey;
let paused = false; // Tracks whether the game is paused
let score = 0;
let scoreText;
let livesText;
let gameOver = false;
let moveEvent;
let difficulty = 1;
let moveTowardPlayerChance = 70; // Initial chance
let stayStillChance = 25;
let moveAwayChance = 5;
let currentInterval = 500; // Initial interval
let startingLives = 3;
let lives = startingLives;
let pauseText;

// Grid settings
const GRID_SIZE = 40;
const GRID_WIDTH = 18;
const GRID_HEIGHT = 10;

// Start the game
const game = new Phaser.Game(config);

// Preload assets
function preload() {
    // Create a red square texture for the player
    let graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xff0000, 1); // Red color
    graphics.fillRect(0, 0, GRID_SIZE, GRID_SIZE);
    graphics.generateTexture('player', GRID_SIZE, GRID_SIZE);
    graphics.clear();

    // Create a white square texture for the defenders
    graphics.fillStyle(0xffffff, 1); // White color
    graphics.fillRect(0, 0, GRID_SIZE, GRID_SIZE);
    graphics.generateTexture('defender', GRID_SIZE, GRID_SIZE);
    graphics.destroy(); // Clean up the graphics object
}

// Create game objects
function create() {
    // Remove any existing moveEvent to prevent duplicate events
    if (moveEvent) {
        moveEvent.remove(false);
        moveEvent = null;
    }

    // Initialize score and lives
    score = 0;
    lives = startingLives;
    gameOver = false;
    paused = false;

    // Reset difficulty variables
    difficulty = 1;
    moveTowardPlayerChance = 70; // Reset to initial chance
    stayStillChance = 25;
    moveAwayChance = 5;
    currentInterval = 500; // Reset to initial interval

    // Create grid lines (optional for visual reference)
     drawGrid(this);

    // Create the player
    player = this.physics.add.sprite(
        GRID_SIZE / 2,
        GRID_SIZE * (GRID_HEIGHT / 2) + GRID_SIZE / 2,
        'player'
    );
    player.setCollideWorldBounds(true);
    player.body.setSize(GRID_SIZE, GRID_SIZE);

    // Create defenders group
    defenders = this.physics.add.group();
    createDefenders(this, 5); // Initial number of defenders

    // Enable keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    // Add WASD keys
    wasdKeys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Display score and lives
    scoreText = this.add.text(10, 10, 'Score: 0', {
        fontSize: '20px',
        fill: '#fff',
    });
    livesText = this.add.text(10, 30, 'Lives: ' + lives, {
        fontSize: '20px',
        fill: '#fff',
    });

    // Set up collision detection
    this.physics.add.overlap(player, defenders, handleCollision, null, this);

    // Set up defender movement event
    moveEvent = this.time.addEvent({
        delay: currentInterval,
        callback: () => updateDefenders(this),
        loop: true,
    });

    // Overlay elements
    setupOverlay.call(this);

    // Create paused text but make it invisible initially
    pauseText = this.add.text(config.width / 2, config.height / 2, 'Paused', {
        fontSize: '40px',
        fill: '#fff',
    });
    pauseText.setOrigin(0.5);
    pauseText.setVisible(false);
}

// Update loop
function update(time) {
    if (gameOver) {
        return;
    }

    // Toggle pause state when 'P' key is just pressed
    if (Phaser.Input.Keyboard.JustDown(pauseKey)) {
        togglePause(this);
    }

    if (paused) {
        return; // Skip the rest of the update when paused
    }

    handlePlayerInput(time);

    // Check if player reached the right edge
    if (player.x >= GRID_SIZE * GRID_WIDTH - GRID_SIZE / 2) {
        score += 1;
        scoreText.setText('Score: ' + score);

        // Celebratory scaling effect
        this.tweens.add({
            targets: scoreText,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            ease: 'Power2',
            yoyo: true,
            onComplete: () => {
                scoreText.setScale(1);
            },
        });

        resetPositions(this);

        if (score % 2 === 0) {
            increaseDifficulty(this);
        }
    }
}

// Function to toggle pause state
function togglePause(scene) {
    paused = !paused; // Toggle the paused state

    if (paused) {
        // Pause physics and timers
        scene.physics.world.pause();

        // Pause defender movement event
        if (moveEvent) {
            moveEvent.paused = true;
        }

        // Show paused overlay
        showPauseOverlay();
    } else {
        // Resume physics and timers
        scene.physics.world.resume();

        // Resume defender movement event
        if (moveEvent) {
            moveEvent.paused = false;
        }

        // Hide paused overlay
        hidePauseOverlay();
    }
}

// Show pause overlay
function showPauseOverlay() {
    pauseText.setVisible(true);
}

// Hide pause overlay
function hidePauseOverlay() {
    pauseText.setVisible(false);
}

// Draw grid lines
function drawGrid(scene) {
    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0x888888, 0.5);

    // Vertical lines
    for (let x = 0; x <= GRID_WIDTH * GRID_SIZE; x += GRID_SIZE) {
        graphics.moveTo(x, 0);
        graphics.lineTo(x, GRID_HEIGHT * GRID_SIZE);
    }

    // Horizontal lines
    for (let y = 0; y <= GRID_HEIGHT * GRID_SIZE; y += GRID_SIZE) {
        graphics.moveTo(0, y);
        graphics.lineTo(GRID_WIDTH * GRID_SIZE, y);
    }

    graphics.strokePath();
}

// Handle player input with movement delay
let lastMoveTime = 0;
const playerMoveDelay = 150; // Adjusted movement delay (milliseconds)

function handlePlayerInput(time) {
    if (time - lastMoveTime < playerMoveDelay) {
        return;
    }

    const speed = GRID_SIZE;
    let moved = false;

    // Capture the intended movement based on keys pressed
    let deltaX = 0;
    let deltaY = 0;

    if (cursors.left.isDown || wasdKeys.left.isDown) {
        deltaX = -speed;
    } else if (cursors.right.isDown || wasdKeys.right.isDown) {
        deltaX = speed;
    }

    if (cursors.up.isDown || wasdKeys.up.isDown) {
        deltaY = -speed;
    } else if (cursors.down.isDown || wasdKeys.down.isDown) {
        deltaY = speed;
    }

    // Check if the new position is within bounds
    const newX = player.x + deltaX;
    const newY = player.y + deltaY;

    if (
        deltaX !== 0 &&
        newX >= GRID_SIZE / 2 &&
        newX <= GRID_SIZE * GRID_WIDTH - GRID_SIZE / 2
    ) {
        player.x = newX;
        moved = true;
    }

    if (
        deltaY !== 0 &&
        newY >= GRID_SIZE / 2 &&
        newY <= GRID_SIZE * GRID_HEIGHT - GRID_SIZE / 2
    ) {
        player.y = newY;
        moved = true;
    }

    if (moved) {
        lastMoveTime = time;
    }
}

// Create defenders
function createDefenders(scene, count) {
    defenders.clear(true, true); // Remove existing defenders
    const playerStartX = GRID_SIZE / 2;
    const playerStartY = GRID_SIZE * (GRID_HEIGHT / 2) + GRID_SIZE / 2;
    const occupiedPositions = new Set();

    // Mark the player's starting position and adjacent cells as occupied
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            const posX = playerStartX + x * GRID_SIZE;
            const posY = playerStartY + y * GRID_SIZE;
            occupiedPositions.add(`${posX},${posY}`);
        }
    }

    let attempts = 0;
    const maxAttempts = 1000;

    for (let i = 0; i < count; i++) {
        let defender;
        let validPosition = false;

        while (!validPosition && attempts < maxAttempts) {
            const x =
                Phaser.Math.Between(2, GRID_WIDTH - 2) * GRID_SIZE +
                GRID_SIZE / 2;
            const y =
                Phaser.Math.Between(1, GRID_HEIGHT - 2) * GRID_SIZE +
                GRID_SIZE / 2;
            const posKey = `${x},${y}`;

            // Check if position and adjacent cells are unoccupied
            let isOccupied = false;
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const checkX = x + dx * GRID_SIZE;
                    const checkY = y + dy * GRID_SIZE;
                    if (occupiedPositions.has(`${checkX},${checkY}`)) {
                        isOccupied = true;
                        break;
                    }
                }
                if (isOccupied) break;
            }

            if (!isOccupied) {
                defender = scene.physics.add.sprite(x, y, 'defender');
                defender.body.setSize(GRID_SIZE, GRID_SIZE);
                defenders.add(defender);

                // Mark defender's position and adjacent cells as occupied
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const occupiedX = x + dx * GRID_SIZE;
                        const occupiedY = y + dy * GRID_SIZE;
                        occupiedPositions.add(`${occupiedX},${occupiedY}`);
                    }
                }

                validPosition = true;
            }
            attempts++;
        }

        if (attempts >= maxAttempts) {
            console.warn('Failed to place all defenders without overlap.');
            break;
        }
    }
}

// Update defenders' positions
function updateDefenders(scene) {
    defenders.children.iterate(function (defender) {
        // Each defender decides independently
        const chance = Phaser.Math.Between(0, 100);

        if (chance < moveTowardPlayerChance) {
            moveTowardPlayer(defender);
        } else if (chance < moveTowardPlayerChance + stayStillChance) {
            // Defender stays still
        } else {
            // Rarely, defender moves away from the player
            moveAwayFromPlayer(defender);
        }
    });
}

// Move defender toward player
function moveTowardPlayer(defender) {
    const speed = GRID_SIZE;
    const possibleMoves = [];

    if (player.x < defender.x && defender.x > GRID_SIZE / 2) {
        possibleMoves.push({ x: defender.x - speed, y: defender.y });
    }
    if (
        player.x > defender.x &&
        defender.x < GRID_SIZE * GRID_WIDTH - GRID_SIZE / 2
    ) {
        possibleMoves.push({ x: defender.x + speed, y: defender.y });
    }
    if (player.y < defender.y && defender.y > GRID_SIZE / 2) {
        possibleMoves.push({ x: defender.x, y: defender.y - speed });
    }
    if (
        player.y > defender.y &&
        defender.y < GRID_SIZE * GRID_HEIGHT - GRID_SIZE / 2
    ) {
        possibleMoves.push({ x: defender.x, y: defender.y + speed });
    }

    Phaser.Utils.Array.Shuffle(possibleMoves);

    for (let move of possibleMoves) {
        if (!willCollideWithDefender(defender, move.x, move.y)) {
            defender.x = move.x;
            defender.y = move.y;
            return;
        }
    }
}

// Move defender away from player
function moveAwayFromPlayer(defender) {
    const speed = GRID_SIZE;
    const possibleMoves = [];

    if (
        player.x < defender.x &&
        defender.x < GRID_SIZE * GRID_WIDTH - GRID_SIZE / 2
    ) {
        possibleMoves.push({ x: defender.x + speed, y: defender.y });
    }
    if (player.x > defender.x && defender.x > GRID_SIZE / 2) {
        possibleMoves.push({ x: defender.x - speed, y: defender.y });
    }
    if (
        player.y < defender.y &&
        defender.y < GRID_SIZE * GRID_HEIGHT - GRID_SIZE / 2
    ) {
        possibleMoves.push({ x: defender.x, y: defender.y + speed });
    }
    if (player.y > defender.y && defender.y > GRID_SIZE / 2) {
        possibleMoves.push({ x: defender.x, y: defender.y - speed });
    }

    Phaser.Utils.Array.Shuffle(possibleMoves);

    for (let move of possibleMoves) {
        if (!willCollideWithDefender(defender, move.x, move.y)) {
            defender.x = move.x;
            defender.y = move.y;
            return;
        }
    }
}

// Check if defender will collide with another defender at new position
function willCollideWithDefender(movingDefender, newX, newY) {
    let collision = false;
    defenders.children.iterate(function (other) {
        if (
            movingDefender !== other &&
            Phaser.Math.Fuzzy.Equal(newX, other.x, 1) &&
            Phaser.Math.Fuzzy.Equal(newY, other.y, 1)
        ) {
            collision = true;
        }
    });
    return collision;
}

// Handle collision between player and defender
function handleCollision(player, defender) {
    lives -= 1;
    livesText.setText('Lives: ' + lives);

    // Flash effect
    player.setTint(0xff0000);
    this.time.addEvent({
        delay: 100,
        callback: () => {
            player.clearTint();
        },
    });

    if (lives <= 0) {
        endGame.call(this);
    } else {
        resetPositions(this);
    }
}

// Reset positions of player and defenders
function resetPositions(scene) {
    // Reset player position
    player.x = GRID_SIZE / 2;
    player.y = GRID_SIZE * (GRID_HEIGHT / 2) + GRID_SIZE / 2;

    // Reset defenders
    createDefenders(scene, defenders.getLength());

    // Reset the moveEvent with the current interval
    if (moveEvent) {
        moveEvent.remove(false);
    }
    moveEvent = scene.time.addEvent({
        delay: currentInterval,
        callback: () => updateDefenders(scene),
        loop: true,
    });
}

// Increase game difficulty
function increaseDifficulty(scene) {
    difficulty += 1;

    // Increase chance to move toward player
    moveTowardPlayerChance = Math.min(90, moveTowardPlayerChance + 5);
    stayStillChance = Math.max(5, stayStillChance - 2);

    // Decrease the interval to speed up the game, but do not go below a minimum
    currentInterval = Math.max(100, currentInterval - 30);

    // Adjust the move event timer
    if (moveEvent) {
        moveEvent.remove(false);
    }
    moveEvent = scene.time.addEvent({
        delay: currentInterval,
        callback: () => updateDefenders(scene),
        loop: true,
    });
}

// End the game
function endGame() {
    gameOver = true;
    this.physics.pause();

    // Remove moveEvent to stop defenders from moving
    if (moveEvent) {
        moveEvent.remove(false);
        moveEvent = null;
    }

    document.getElementById('overlay').classList.add('visible');
    document.getElementById('final-score').innerText = 'Score: ' + score;
    displayHighScores();
}

// Overlay setup
function setupOverlay() {
    const saveButton = document.getElementById('save-score-button');
    const retryButton = document.getElementById('retry-button');

    saveButton.addEventListener('click', saveHighScore);
    retryButton.addEventListener('click', () => {
        // Restart the scene
        this.scene.restart();
        document.getElementById('overlay').classList.remove('visible');
    });
}

// Save high score to localStorage
function saveHighScore() {
    const name = document.getElementById('player-name').value.trim();
    if (name === '') return;

    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ name, score });
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(10); // Keep top 10

    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
}

// Display high scores
function displayHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = highScores
        .map((entry) => `<li>${entry.name}: ${entry.score}</li>`)
        .join('');
}