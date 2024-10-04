//Explanation

//	1.	Constructor (constructor):
//	•	Initializes the defender’s position at a random location on the grid, ensuring the defender is not in the first three columns.
//	2.	Draw Method (draw):
//	•	Draws the defender on the canvas as a rectangle at the defender’s current position.
//	3.	Move Toward Player Method (moveTowardPlayer):
//	•	Moves the defender one step closer to the player’s position by adjusting the defender’s coordinates.
//	4.	Move Randomly Method (moveRandomly):
//	•	Moves the defender one step in a random direction (up, down, left, or right) while ensuring the defender stays within the grid boundaries.
//	5.	Valid Position Check (isValidPosition):
//	•	Checks if the defender’s current position is valid by ensuring it does not overlap with other defenders and is not immediately adjacent to other defenders unless it’s the player’s position.
//	6.	Proximity Check (isNextToPlayer):
//	•	Checks if the defender is adjacent to the player’s position by calculating the distance between the defender and the player.

class Defender {
    constructor() {
        // Initialize the defender's position at a random location on the grid,
        // ensuring the defender is not in the first three columns.
        this.position = [Math.floor(Math.random() * (GRID_WIDTH - 3)) + 3, Math.floor(Math.random() * GRID_HEIGHT)];
    }

    // Method to draw the defender on the canvas.
    draw(ctx) {
        ctx.fillStyle = DEFENDER_COLOR; // Set the color for the defender.
        ctx.fillRect(this.position[0] * GRID_SIZE, this.position[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE); // Draw the defender as a rectangle.
    }

    // Method to move the defender toward the player's position.
    moveTowardPlayer(playerPosition) {
        // Adjust the defender's position to move closer to the player's position.
        if (this.position[0] < playerPosition[0]) this.position[0] += 1;
        else if (this.position[0] > playerPosition[0]) this.position[0] -= 1;
        if (this.position[1] < playerPosition[1]) this.position[1] += 1;
        else if (this.position[1] > playerPosition[1]) this.position[1] -= 1;
    }

    // Method to move the defender in a random direction.
    moveRandomly() {
        const directions = ['up', 'down', 'left', 'right']; // Possible movement directions.
        let newDirection = directions[Math.floor(Math.random() * directions.length)]; // Randomly choose a direction.
        let newPosition = [...this.position]; // Create a copy of the current position.

        // Adjust the defender's position based on the chosen direction.
        if (newDirection === 'up' && this.position[1] > 0) newPosition[1] -= 1;
        else if (newDirection === 'down' && this.position[1] < GRID_HEIGHT - 1) newPosition[1] += 1;
        else if (newDirection === 'left' && this.position[0] > 0) newPosition[0] -= 1;
        else if (newDirection === 'right' && this.position[0] < GRID_WIDTH - 1) newPosition[0] += 1;

        // Update the defender's position.
        this.position = newPosition;
    }

    // Method to check if the defender's position is valid.
    isValidPosition(occupiedPositions, playerPosition) {
        const posStr = this.position.toString(); // Convert the position to a string for comparison.
        // Define the positions of the cells adjacent to the current position.
        const neighbors = [
            [this.position[0] - 1, this.position[1]].toString(),
            [this.position[0] + 1, this.position[1]].toString(),
            [this.position[0], this.position[1] - 1].toString(),
            [this.position[0], this.position[1] + 1].toString()
        ];

        // Check if the current position or any of its neighbors (excluding the player's position) are occupied.
        return !occupiedPositions.has(posStr) &&
               !neighbors.some(n => occupiedPositions.has(n) && n !== playerPosition.toString());
    }

    // Method to check if the defender is adjacent to the player's position.
    isNextToPlayer(playerPosition) {
        const dx = Math.abs(this.position[0] - playerPosition[0]); // Calculate the horizontal distance to the player.
        const dy = Math.abs(this.position[1] - playerPosition[1]); // Calculate the vertical distance to the player.
        return dx + dy === 1;  // Return true if the defender is adjacent to the player.
    }
}