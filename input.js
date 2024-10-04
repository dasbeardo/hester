// Explanation

//	1.	Event Listeners:
//	•	keydown Event:
//	•	When a key is pressed, the keydown event is triggered.
//	•	The function getKeyDirection(e.keyCode) is called to determine the direction associated with the key code.
//	•	If a valid direction is returned, the corresponding key in the keysPressed object is set to true.
//	•	keyup Event:
//	•	When a key is released, the keyup event is triggered.
//	•	The function getKeyDirection(e.keyCode) is called to determine the direction associated with the key code.
//	•	If a valid direction is returned, the corresponding key in the keysPressed object is set to false.
//	2.	getKeyDirection Function:
//	•	Takes a key code as input and returns the corresponding direction as a string ('left', 'up', 'right', 'down').
//	•	If the key code does not correspond to one of the arrow keys, the function returns null.
//	3.	handleInput Function:
//	•	Takes the player object, keysPressed object, and lastMoveTimes object as arguments.
//	•	Gets the current time using Date.now().
//	•	Iterates over each direction key in the keysPressed object.
//	•	If the key is pressed (true) and enough time has passed since the last move (now >= lastMoveTimes[key]), the player is moved in that direction.
//	•	Updates the lastMoveTimes for the direction to the current time plus the PLAYER_MOVE_DELAY to ensure the player does not move too quickly when the key is held down.

// Event listener for keydown events
document.addEventListener('keydown', (e) => {
  // Get the direction corresponding to the key pressed
  const direction = getKeyDirection(e.keyCode);
  if (direction) {
      keysPressed[direction] = true; // Set the corresponding direction key to true
  }
});

// Event listener for keyup events
document.addEventListener('keyup', (e) => {
  // Get the direction corresponding to the key released
  const direction = getKeyDirection(e.keyCode);
  if (direction) {
      keysPressed[direction] = false; // Set the corresponding direction key to false
  }
});

// Function to get the direction based on the key code
function getKeyDirection(keyCode) {
  switch (keyCode) {
      case 37: return 'left'; // Left arrow key
      case 38: return 'up'; // Up arrow key
      case 39: return 'right'; // Right arrow key
      case 40: return 'down'; // Down arrow key
      default: return null; // Return null for any other key
  }
}

// Function to handle player input and move the player
function handleInput(player, keysPressed, lastMoveTimes) {
  const now = Date.now(); // Get the current time

  // Loop through each direction key
  for (const key in keysPressed) {
      if (keysPressed[key] && now >= lastMoveTimes[key]) {
          player.move(key); // Move the player in the direction of the key pressed
          lastMoveTimes[key] = now + PLAYER_MOVE_DELAY; // Update the last move time for the direction
      }
  }
}