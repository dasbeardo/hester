// Explanation

//	1.	Draw Grid Function (drawGrid):
//	•	Purpose: Draws a grid on the canvas to help visualize the game’s playing field.
//	•	ctx.strokeStyle = GRID_COLOR;:
//	•	Sets the stroke color for the grid lines to the predefined GRID_COLOR.
//	•	Vertical Grid Lines:
//	•	Loop: Iterates over the width of the canvas in steps of GRID_SIZE.
//	•	ctx.beginPath();: Starts a new path for each line.
//	•	ctx.moveTo(x, 0);: Moves the drawing cursor to the top of the current vertical line.
//	•	ctx.lineTo(x, canvas.height);: Draws the vertical line to the bottom of the canvas.
//	•	ctx.stroke();: Renders the line on the canvas.
//	•	Horizontal Grid Lines:
//	•	Loop: Iterates over the height of the canvas in steps of GRID_SIZE.
//	•	ctx.beginPath();: Starts a new path for each line.
//	•	ctx.moveTo(0, y);: Moves the drawing cursor to the left of the current horizontal line.
//	•	ctx.lineTo(canvas.width, y);: Draws the horizontal line to the right edge of the canvas.
//	•	ctx.stroke();: Renders the line on the canvas.
//	2.	Draw Text Function (drawText):
//	•	Purpose: Draws text on the canvas.
//	•	ctx.fillStyle = TEXT_COLOR;:
//	•	Sets the fill color for the text to the predefined TEXT_COLOR.
//	•	ctx.font = ${size}px Arial;:
//	•	Sets the font size and family for the text. The size parameter specifies the font size.
//	•	ctx.fillText(text, x, y);:
//	•	Draws the specified text at the position (x, y) on the canvas.

// Function to draw the grid on the canvas
function drawGrid(ctx) {
  ctx.strokeStyle = GRID_COLOR; // Set the color for the grid lines

  // Draw vertical grid lines
  for (let x = 0; x < canvas.width; x += GRID_SIZE) {
      ctx.beginPath(); // Start a new path for each line
      ctx.moveTo(x, 0); // Move to the starting point of the line
      ctx.lineTo(x, canvas.height); // Draw the line to the bottom of the canvas
      ctx.stroke(); // Render the line
  }

  // Draw horizontal grid lines
  for (let y = 0; y < canvas.height; y += GRID_SIZE) {
      ctx.beginPath(); // Start a new path for each line
      ctx.moveTo(0, y); // Move to the starting point of the line
      ctx.lineTo(canvas.width, y); // Draw the line to the right edge of the canvas
      ctx.stroke(); // Render the line
  }
}

// Function to draw text on the canvas
function drawText(ctx, text, x, y, size) {
  ctx.fillStyle = TEXT_COLOR; // Set the color for the text
  ctx.font = `${size}px Arial`; // Set the font size and family for the text
  ctx.fillText(text, x, y); // Draw the text at the specified position
}