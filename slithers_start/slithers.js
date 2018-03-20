/**
 * A Snake style game implemented in JavaScript using an HTML canvas for drawing. This is intended as a tool to teach game development
 * and computer science to the uninitiated.
 */

/**
 * These are our constant values.
 *
 * Constants are a necessity to good programming as they allow later changes to be made system wide as long as the constant is used
 * instead of "magic values/numbers" across the code.
 */
// ASCII key codes stored as constants for readability.
var KEY_PRESS_LEFT = 37;
var KEY_PRESS_RIGHT = 39;
var KEY_PRESS_DOWN = 40;
var KEY_PRESS_UP = 38;
var KEY_PRESS_ENTER = 13;

/**
 * These are our game state variables. Variables are used to store pieces of data such as numbers, strings, boolean values, etc.
 * A variable can be assigned a value, and the value may be changed via numerous operators: + - * / =.
 */
// A reference to the canvas we use to draw the game.
var canvas = null;
// A reference to the current board's information: a multidimensional array where a wall is represented by -1, an empty spot by 0.
var board = null;
// Calculate the walls of the board.
var topLimit = 0;
var bottomLimit = 0;
var leftLimit = 0;
var rightLimit = 0;
// Whether or not we have hit the Game Over state. Is either true or false.
var gameOver = false;
// The image for the board's wall piece.
var wallImage = null;
// The image for the floor piece.
var floorImage = null;
// The image for a snake head piece.
var headImage = null;
// The image for a body piece.
var bodyImage = null;
// The image for the apple piece.
var appleImage = null;
// Stores the key that was pressed.
var playerKeyPress = 0;
// The number of frames since the last time we forced the players piece to drop.
var frameCount = 0;
// The current number of frames per forceful drop of the players piece. Updated whenever the player scores ten lines to slowly increase the game difficulty.
var framesPerDrop = 30;
// Initial position of the snake head with 3 body segments.
var snake = null;
// This is used to check if the snake is trying to curve back in on itself.
var lastSnakeDirection = "left";
// The position of the apple.
var applePosition = {
  x: 15,
  y: 15
};

/**
 * We define the structure of the board in a method so a new one can be created whenever a new game begins. A constant for
 * the board's definition would require us to copy to a board array each time the game starts, creating a new instance of
 * the data is simpler.
 */
function getNewBoard() {
  board = [
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
  ];

  // Calculate the walls of the board.
  topLimit = 0;
  bottomLimit = board.length - 1;
  leftLimit = 0;
  rightLimit = board[0].length - 1;
}

/**
 * Creates a new snake array.
 */
function resetSnake() {
  return [
    {
      x: 23,
      y: 17
    },
    {
      x: 24,
      y: 17
    },
    {
      x: 25,
      y: 17
    },
    {
      x: 26,
      y: 17
    }
  ];
}

/**
 * Sets up our game. Stores a reference to the canvas, sets up key listening, and starts our game loop.
 */
function onLoad() {
  // Setup our game loop to listen for a change every 16 milliseconds.
  window.setInterval(gameLoop, 16);

  // We draw via the canvas's 2d context, so we store a reference for drawing.
  canvas = document.getElementById("canvas").getContext("2d");

  // We load in all of our images from the HTML file.
  wallImage = document.getElementById("wall_piece");
  floorImage = document.getElementById("floor_piece");
  headImage = document.getElementById("head_piece");
  bodyImage = document.getElementById("body_piece");
  appleImage = document.getElementById("apple_piece");

  // Every time a key is pressed, store it to be processed in the game loop.
  document.addEventListener('keydown', function (event) {
    playerKeyPress = event.keyCode;
  });

  // Make sure to set the key press to false when it's done being "pressed".
  document.addEventListener('keyup', function (event) {
    playerKeyPress = 0;
  });

  newGame();
}

/**
 * Sets up a new game by initializing all of the game state variables.
 */
function newGame() {
  // Create and assign a new board.
  getNewBoard();
  // Create new snake.
  snake = resetSnake();
  // Get a random apple position.
  newAppleLocation();
  // Reset our gameOver flag.
  gameOver = false;
}

/**
 * The heart of the game, the game loop calls functions to handle inputs, control game state and draw the game.
 */
function gameLoop() {
  // If our game isn't over, figure out what the next move is.
  if (!gameOver) {
    handleInput();
  }
  else {
    // If our game is over, and our player wants to start a new one, load it up!
    if (playerKeyPress == KEY_PRESS_ENTER) {
      newGame();
    }
  }

  drawGame();
}

/**
 * Draws an image to the canvas at the specified location with rotation and mirroring.
 */
function drawImage(image, x, y, angle, mirror) {
  canvas.translate(x + (image.width / 2), y + (image.height / 2));

  canvas.rotate(angle * Math.PI / 180);

  if (mirror) {
    canvas.scale(-1, 1);
  }
  else {
    canvas.scale(1, 1);
  }

  canvas.drawImage(image, -4, -4);

  canvas.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * Steps through our snake's body, and moves each segment forward by one space.
 */
function moveSnakeBody() {
  for (var segment = snake.length - 1; segment >= 1; segment --) {
    snake[segment].x = snake[segment - 1].x;
    snake[segment].y = snake[segment - 1].y;
  }
}

/**
 * Push a new segment onto the end of our snake array.
 */
function growSnakeBody(newX, newY) {
  snake.push({
    x: newX,
    y: newY
  });
}

/**
 * Checks the position of our snake's head and the apple, returns TRUE if they're at the same position.
 */
function checkAppleEaten(xDelta, yDelta) {
  if (snake[0].x + xDelta == applePosition.x && snake[0].y + yDelta == applePosition.y) {
    newAppleLocation();
    return true;
  }
  return false;
}

/**
 * Generate a random position for the apple and make sure it doesn't conflict with any walls or snake segments.
 */
function newAppleLocation() {
  var newX = randInt(leftLimit + 1, rightLimit - 1);
  var newY = randInt(topLimit + 1, bottomLimit - 1);
  while (snakeIntersect(newX, newY)) {
    newX = randInt(leftLimit + 1, rightLimit - 1);
    newY = randInt(topLimit + 1, bottomLimit - 1);
  }
  applePosition.x = newX;
  applePosition.y = newY;
}

/**
 * Generates a random integer between the upper and lower limits inclusive.
 */
function randInt(lower, upper) {
  return Math.round(Math.random() * (upper - lower)) + lower;
}

/**
 * Checks if any section of the snake intersects with a position.
 */
function snakeIntersect(xIndex, yIndex) {
  for (var x = 0; x < snake.length; x ++) {
    if (snake[x].x == xIndex && snake[x].y == yIndex) {
      return true;
    }
  }
  return false;
}

/**
 * Update the position of the snake based on the input.
 */
function handleInput() {
  var xDelta = 0;
  var yDelta = 0;

  if (xDelta != 0 || yDelta != 0) {
    // Draw the snake.
  }
}

/**
 * Draw the game by drawing the board, then the apple, then the snake, and if necessary game over text.
 */
function drawGame() {
  // Draw the board.
  drawBoard();

  // Draw the snake.
  for (var segment = 0; segment < snake.length; segment ++) {
    var image;
    // Fill in the correct image.
    drawImage(image, snake[segment].x * 8, snake[segment].y * 8, 0, false);
  }

  // Draw the apple.

}

/*
 * Draws the two dimensional array of the board.
 */
function drawBoard() {
  for (var x = 0; x < board[0].length; x ++) {
    for (var y = 0; y < board.length; y ++) {
      var value = board[y][x];
      var image;
      // Fill in the correct image and draw it to the canvas.
    }
  }
}
