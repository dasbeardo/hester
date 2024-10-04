// 	1.	Increase Difficulty Function (increaseDifficulty):
//	•	Purpose: Adjusts the game difficulty by increasing the number of defenders, the speed of the game, and the likelihood of defenders moving toward the player.
//	•	Details:
//	•	Increases the difficulty level by 1.
//	•	Every 12 difficulty levels, adds a new defender up to a maximum of 11 defenders.
//	•	Slightly decreases the game speed (increases the interval) when a new defender is added.
//	•	Decreases the interval (increases speed) at each difficulty increase, but does not go below MIN_INTERVAL.
//	•	Increases the likelihood of defenders moving toward the player, up to MAX_MOVE_TOWARD_PLAYER_CHANCE.
//	2.	Update Defenders Function (updateDefenders):
//	•	Purpose: Updates the positions and behaviors of the defenders based on the current game state.
//	•	Details:
//	•	Creates a set of currently occupied positions by defenders.
//	•	Iterates over each defender to determine and update their new position.
//	•	Increases the likelihood of a defender moving toward the player if they are adjacent.
//	•	Moves the defender based on the adjusted likelihood (moveTowardPlayerChance).
//	•	Checks for collisions with the player and handles tackles, resetting the player’s position and decrementing lives if a tackle occurs.
//	•	Validates the new position of the defender and reverts to the initial position if the new position is invalid or occupied.
//	•	Updates the set of occupied positions with the new valid position.

// Function to increase the game difficulty
function increaseDifficulty() {
    difficulty += 1; // Increment the difficulty level

    // Every 12 difficulty levels, add a new defender, up to a maximum of 11 defenders
    if (difficulty % 12 === 0 && defenders.length < 11) {
        defenders.push(new Defender());
        currentInterval *= 1.1; // Slightly decrease speed (increase interval)
    }

    // Increase game speed by decreasing the interval, but do not go below MIN_INTERVAL
    currentInterval = Math.max(MIN_INTERVAL, currentInterval * 0.99);

    // Increase the likelihood of defenders moving toward the player, up to a maximum value
    moveTowardPlayerChance = Math.min(MAX_MOVE_TOWARD_PLAYER_CHANCE, INITIAL_MOVE_TOWARD_PLAYER_CHANCE + (difficulty - 1) * 0.9);
}

// Function to update the positions and behavior of defenders
function updateDefenders(defenders, player, moveTowardPlayerChance) {
    // Create a set of currently occupied positions
    const occupiedPositions = new Set(defenders.map(def => def.position.toString()));

    // Iterate over each defender to update its position
    defenders.forEach(defender => {
        const initialPosition = defender.position.toString(); // Store the initial position as a string
        let currentMoveTowardPlayerChance = moveTowardPlayerChance;

        // Increase the likelihood of moving toward the player if the defender is adjacent to the player
        if (defender.isNextToPlayer(player.position)) {
            currentMoveTowardPlayerChance += 50;  // Increase the likelihood by 50%
        }

        // Determine the defender's new position based on the adjusted likelihood
        if (Math.random() * 100 < currentMoveTowardPlayerChance) {
            defender.moveTowardPlayer(player.position);
        } else {
            defender.moveRandomly();
        }

        const newPosition = defender.position.toString(); // Convert the new position to a string

        // Check for collision with the player
        if (newPosition === player.position.toString()) {
            console.log('Defender tackled the player at', newPosition); // Log the tackle
            player.lives -= 1; // Decrement the player's lives

            // If the player has no lives left, end the game
            if (player.lives <= 0) {
                gameOver = true;
                gameOverDiv.style.display = 'flex';
                scoreDisplay.textContent = `Score: ${score}`;
                return;
            }

            // Reset the player's position after a tackle
            player.position = [0, Math.floor(GRID_HEIGHT / 2)];
            console.log('Player position reset to', player.position);
        // If the new position is invalid or occupied, revert to the initial position
        } else if (occupiedPositions.has(newPosition) || !defender.isValidPosition(occupiedPositions, player.position)) {
            console.log('Invalid or occupied position, reverting to', initialPosition); // Log the reversion
            defender.position = initialPosition.split(',').map(Number); // Revert to original position if new position is occupied or invalid
        // Otherwise, update the set of occupied positions with the new position
        } else {
            occupiedPositions.delete(initialPosition);
            occupiedPositions.add(newPosition);
            console.log('Updated defender position to', newPosition); // Log the new position
        }
    });
}