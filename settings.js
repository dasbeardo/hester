// Explanation

//	1.	Grid and Canvas Settings:
//	•	GRID_SIZE: Defines the size of each cell in the grid, in pixels.
//	•	GRID_WIDTH: The number of cells horizontally in the grid.
//	•	GRID_HEIGHT: The number of cells vertically in the grid.
//	2.	Color Settings:
//	•	BACKGROUND_COLOR: Sets the background color of the canvas.
//	•	PLAYER_COLOR: Sets the color of the player.
//	•	DEFENDER_COLOR: Sets the color of the defenders.
//	•	GRID_COLOR: Sets the color of the grid lines.
//	•	TEXT_COLOR: Sets the color of the text displayed on the canvas.
//	3.	Difficulty Settings:
//	•	INITIAL_DEFENDERS: The initial number of defenders at the start of the game.
//	•	BASE_INTERVAL: The initial interval for updating the game state (i.e., how often the game state is refreshed), in milliseconds.
//	•	MIN_INTERVAL: The minimum interval for updating the game state to prevent the game from becoming too fast, in milliseconds.
//	•	INITIAL_MOVE_TOWARD_PLAYER_CHANCE: The initial probability (in percent) that a defender will move towards the player.
//	•	MAX_MOVE_TOWARD_PLAYER_CHANCE: The maximum probability (in percent) that a defender will move towards the player.
//	4.	Player Movement Delay:
//	•	PLAYER_MOVE_DELAY: The delay between player movements when a key is held down, in milliseconds. This prevents the player from moving too quickly when a key is held down.
//	5.	Starting Lives:
//	•	STARTING_LIVES: The initial number of lives the player starts with.

// settings.js

// Grid and canvas settings
const GRID_SIZE = 20; // The size of each cell in the grid, in pixels
const GRID_WIDTH = 18; // The number of cells horizontally
const GRID_HEIGHT = 10; // The number of cells vertically

// Color settings
const BACKGROUND_COLOR = 'black'; // The background color of the canvas
const PLAYER_COLOR = 'red'; // The color of the player
const DEFENDER_COLOR = 'white'; // The color of the defenders
const GRID_COLOR = 'gray'; // The color of the grid lines
const TEXT_COLOR = 'white'; // The color of the text

// Difficulty settings
const INITIAL_DEFENDERS = 5; // The initial number of defenders
const BASE_INTERVAL = 500; // The initial interval for updating the game state, in milliseconds
const MIN_INTERVAL = 100; // The minimum interval for updating the game state, in milliseconds
const INITIAL_MOVE_TOWARD_PLAYER_CHANCE = 50; // The initial chance for defenders to move toward the player, in percent
const MAX_MOVE_TOWARD_PLAYER_CHANCE = 100; // The maximum chance for defenders to move toward the player, in percent

// Player movement delay
const PLAYER_MOVE_DELAY = 200; // The delay between player movements when a key is held down, in milliseconds

// Starting lives
const STARTING_LIVES = 3; // The initial number of lives for the player