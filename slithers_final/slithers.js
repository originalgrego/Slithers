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
// A reference to the current board's information: a multidimensional array where a wall is represented by
// 2, a player piece by 1, an empty spot by 0, and the "game over" zone by -1.
var board = null;
// Calculate the walls of the board.
var topLimit = 0;
var bottomLimit = 0;
var leftLimit = 0;
var rightLimit = 0;
// Whether or not we have hit the Game Over state. Is either true or false.
var gameOver = false;
// The image for a snake head piece.
var snakeImageUp = null;
// The image for a snake head piece.
var snakeImageDown = null;
// The image for a snake head piece.
var snakeImageLeft = null;
// The image for a snake head piece.
var snakeImageRight = null;
// The image for a body piece.
var bodyImage = null;
// The image for the board's wall piece.
var boardImage = null;
// The image for the apple piece.
var appleImage = null;
// The image for the floor piece.
var floorImage = null;
// Stores the key that was pressed.
var playerKeyPress = 0;
// The number of frames since the last time we forced the players piece to drop.
var frameCount = 0;
// The current number of frames per forceful drop of the players piece. Updated whenever the player scores ten lines to slowly increase
// the game difficulty.
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
  snakeImageUp = document.getElementById("head_piece_up");
  snakeImageDown = document.getElementById("head_piece_down");
  snakeImageLeft = document.getElementById("head_piece_left");
  snakeImageRight = document.getElementById("head_piece_right");
  bodyImage = document.getElementById("body_piece");
  boardImage = document.getElementById("wall_piece");
  appleImage = document.getElementById("apple_piece");
  floorImage = document.getElementById("floor_piece");

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
  // Reset snake.
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
 * Update the position of the snake based on the input.
 */
function handleInput() {
  var xDelta = 0;
  var yDelta = 0;

  if (playerKeyPress == KEY_PRESS_LEFT && lastSnakeDirection !== "right") { // If the player presses left, store a left movement in xDelta.
    lastSnakeDirection = "left";
    xDelta --;
    frameCount = 0;
  }
  else if (playerKeyPress == KEY_PRESS_RIGHT && lastSnakeDirection !== "left") { // If the player presses right, store a right movement in xDelta.
    lastSnakeDirection = "right";
    xDelta ++;
    frameCount = 0;
  }
  else if (playerKeyPress == KEY_PRESS_DOWN && lastSnakeDirection !== "up") { // If the player presses down, store a down movement in YDelta.
    lastSnakeDirection = "down";
    yDelta ++;
    frameCount = 0;
  }
  else if (playerKeyPress == KEY_PRESS_UP && lastSnakeDirection !== "down") { // If the player presses down, store a down movement in YDelta.
    lastSnakeDirection = "up";
    yDelta --;
    frameCount = 0;
  }

  // Force our snake to move a position if enough time has passed.
  if (frameCount > framesPerDrop) {
    if (lastSnakeDirection == "up") {
      yDelta --;
    }
    else if (lastSnakeDirection == "down") {
      yDelta ++;
    }
    else if (lastSnakeDirection == "right") {
      xDelta ++;
    }
    else {
      xDelta --;
    }
    frameCount = 0;
  }
  frameCount ++;

  // Reset our key press so that new user input may be easily identified in the next frame.
  playerKeyPress = 0;

  moveSnakeBody(xDelta, yDelta);

  checkGameOver(xDelta, yDelta);

  if (gameOver) {
    return;
  }

  snake[0].x += xDelta;
  snake[0].y += yDelta;

  // Check to see if we're in the wrap around area.
  if (snake[0].x == board[0].length && lastSnakeDirection == "right") {
    snake[0].x = 0;
  }
  if (snake[0].x == -1 && lastSnakeDirection == "left") {
    snake[0].x = board[0].length - 1;
  }
}

/**
 * Draw our game board, two paddles, ball, and scores.
 */
function drawGame() {
  // Draw the board.
  drawBoard();

  // Apply the sprites to the board.
  applyAppleToBoard();
  applySnakeHeadToBoard();

  // If we hit a game over, show a game over message.
  if (gameOver) {
    canvas.fillStyle = "red";
    canvas.font = "30px Arial";
    canvas.fillText("GAME OVER", 50, 110);
  }
}

/*
 * Draws the two dimensional array of the board.
 */
function drawBoard() {
  for (var x = 0; x < board[0].length; x++) {
    for (var y = 0; y < board.length; y++) {
      var value = board[y][x];
      var image;
      if (value == 0) {
        image = floorImage;
      }
      if (value == -1) {
        image = boardImage;
      }
      canvas.drawImage(image, x * 8, y * 8);
    }
  }
}

/**
 * Steps through our snake's body, and moves each segment forward by one space.
 */
function moveSnakeBody(xDelta, yDelta) {
  if (xDelta != 0 || yDelta != 0) {
    var lastSegmentX = snake[snake.length - 1].x;
    var lastSegmentY = snake[snake.length - 1].y;

    for (var segment = snake.length - 1; segment >= 1; segment --) {
      snake[segment].x = snake[segment - 1].x;
      snake[segment].y = snake[segment - 1].y;
    }
    // Check to see if we're growing.
    if (checkAppleEaten(xDelta, yDelta)) {
      snake.push({
        x: lastSegmentX,
        y: lastSegmentY
      });
    }
  }
}

/**
 * Checks the position of our snake's head and the apple, returns TRUE if they're at the same position.
 */
function checkAppleEaten(xDelta, yDelta) {
  // Check to see if we're growing.
  if (snake[0].x + xDelta == applePosition.x && snake[0].y + yDelta == applePosition.y) {
    newAppleLocation();
    return true;
  }
  return false;
}

/**
 * Add the new player piece to its spot on the board.
 * Checks for what direction the snake is heading, and changing the image of the snake's head.
 */
function applySnakeHeadToBoard() {
  for (var segment = 0; segment < snake.length; segment ++) {
    var image;
    if (segment == 0) {
      if (lastSnakeDirection == "left") {
        image = snakeImageLeft;
      }
      if (lastSnakeDirection == "right") {
        image = snakeImageRight;
      }
      if (lastSnakeDirection == "up") {
        image = snakeImageUp;
      }
      if (lastSnakeDirection == "down") {
        image = snakeImageDown;
      }
    }
    else {
      image = bodyImage;
    }
    canvas.drawImage(image, snake[segment].x * 8, snake[segment].y * 8);
  }
}

/**
 * Add the new player piece to its spot on the board.
 */
function applyAppleToBoard() {
  canvas.drawImage(appleImage, applePosition.x * 8, applePosition.y * 8);
}

/**
 * Generate a random position for the apple and make sure it doesn't conflict with any walls or snake segments.
 */
function newAppleLocation() {
  var newX = Math.floor(Math.random() * (rightLimit - 1)) + 1;
  var newY = Math.floor(Math.random() * (bottomLimit -1)) + 1;
  while (snakeIntersect(newX, newY)) {
    newX = Math.floor(Math.random() * (rightLimit - 1)) + 1;
    newY = Math.floor(Math.random() * (bottomLimit -1)) + 1;
  }
  applePosition.x = newX;
  applePosition.y = newY;
}

/**
 * See if the inputs are in the same position as a piece of the snake.
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
 * Check to see if a piece overlaps with the snake or a wall.
 */
function checkGameOver(xDelta, yDelta) {
  if (xDelta != 0 || yDelta != 0) {
    var newX = snake[0].x + xDelta;
    var newY = snake[0].y + yDelta;
    if (snakeIntersect(newX, newY) || board[newY][newX] == -1) {
      gameOver = true;
    }
  }
}

/**
 * An unused feature to bounce a snake off of a wall instead of causing a gameOver.
 */
function bounceOffWalls(xDelta, yDelta) {
  if (snake[0].x + xDelta == leftLimit) {
    if (snake[0].y == topLimit + 1) {
      lastSnakeDirection = "down";
      yDelta ++;
    }
    else {
      lastSnakeDirection = "up";
      yDelta--;
    }
    xDelta = 0;
  }
  else if (snake[0].x + xDelta == rightLimit) {
    if (snake[0].y == bottomLimit - 1) {
      lastSnakeDirection = "up";
      yDelta -- ;
    }
    else {
      lastSnakeDirection = "down";
      yDelta++;
    }
    xDelta = 0;
  }
  else if (snake[0].y + yDelta == topLimit) {
    if (snake[0].x == leftLimit + 1) {
      lastSnakeDirection = "right";
      xDelta ++;
    }
    else {
      lastSnakeDirection = "left";
      xDelta --;
    }
    yDelta = 0;
  }
  else if (snake[0].y + yDelta == bottomLimit) {
    if (snake[0].x == rightLimit - 1) {
      lastSnakeDirection = "left";
      xDelta --;
    }
    else {
      lastSnakeDirection = "right";
      xDelta ++;
    }
    yDelta = 0;
  }
}