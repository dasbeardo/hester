// Explanation

//	1.	Constructor (constructor):
//	•	Initializes the player’s position at the start of the grid, vertically centered.
//	•	this.position = [0, Math.floor(GRID_HEIGHT / 2)];:
//	•	Sets the player’s initial horizontal position to 0 (leftmost column).
//	•	Sets the player’s initial vertical position to the middle row of the grid (Math.floor(GRID_HEIGHT / 2)).
//	2.	Draw Method (draw):
//	•	Draws the player on the canvas.
//	•	ctx.fillStyle = PLAYER_COLOR;:
//	•	Sets the drawing color to the predefined player color.
//	•	ctx.fillRect(this.position[0] * GRID_SIZE, this.position[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE);:
//	•	Draws a rectangle at the player’s current position. The rectangle’s top-left corner is positioned at (this.position[0] * GRID_SIZE, this.position[1] * GRID_SIZE), and its size is defined by GRID_SIZE.
//	3.	Move Method (move):
//	•	Moves the player in the specified direction, ensuring the player stays within the grid boundaries.
//	•	Direction Checks:
//	•	'left': If the left arrow key is pressed and the player is not already at the leftmost column (this.position[0] > 0), the player’s horizontal position is decremented by 1.
//	•	'right': If the right arrow key is pressed and the player is not already at the rightmost column (this.position[0] < GRID_WIDTH - 1), the player’s horizontal position is incremented by 1.
//	•	'up': If the up arrow key is pressed and the player is not already at the top row (this.position[1] > 0), the player’s vertical position is decremented by 1.
//	•	'down': If the down arrow key is pressed and the player is not already at the bottom row (this.position[1] < GRID_HEIGHT - 1), the player’s vertical position is incremented by 1.

class Player {
    constructor() {
        // Initialize the player's position at the start of the grid, vertically centered
        this.position = [0, Math.floor(GRID_HEIGHT / 2)];
    }

    // Method to draw the player on the canvas
    draw(ctx) {
        ctx.fillStyle = PLAYER_COLOR; // Set the color for the player
        ctx.fillRect(this.position[0] * GRID_SIZE, this.position[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE); // Draw the player as a rectangle
    }

    // Method to move the player in the specified direction
    move(direction) {
        // Update the player's position based on the direction, ensuring they stay within grid boundaries
        if (direction === 'left' && this.position[0] > 0) {
            this.position[0] -= 1; // Move left
        } else if (direction === 'right' && this.position[0] < GRID_WIDTH - 1) {
            this.position[0] += 1; // Move right
        } else if (direction === 'up' && this.position[1] > 0) {
            this.position[1] -= 1; // Move up
        } else if (direction === 'down' && this.position[1] < GRID_HEIGHT - 1) {
            this.position[1] += 1; // Move down
        }
    }
}