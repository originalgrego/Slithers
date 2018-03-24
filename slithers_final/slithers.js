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

var HEX_LETTERS = ["A", "B", "C", "D", "E", "F"];


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
var headImage = null;

var openMouthImage = null;

// The image for a body piece.
var bodyImage = null;

var tailImage = null;

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
var framesPerDrop = 45;
// Initial position of the snake head with 3 body segments.
var snake = null;

var widthTextBox = null;
var heightTextBox = null;

var editLevel = false;

// This is used to check if the snake is trying to curve back in on itself.
var lastSnakeDirection = "left";
// The position of the apple.
var applePosition = {
  x: 15,
  y: 15
};

var sizeModifier = 0.1;
var sizeModifierDelta = 0.006125;

var currentZoom = 4;

var MAZE_LEVEL = "X[36]Y[25]:fffffffff100000008dfffffffb10000000affdfffffa10000008adffffff2a1000008abdbf7ffb28100000aabffffffaa8100000aaecfffffba2110000aaa5dffefaaa550000aaa55ff7f2aa55104ffba11df510aa5510450aa55df55ffa51000500a5fff7dffb500001008fffffffff";

/**
 * We define the structure of the board in a method so a new one can be created whenever a new game begins. A constant for
 * the board's definition would require us to copy to a board array each time the game starts, creating a new instance of
 * the data is simpler.
 */
function getNewBoard() {
  return [
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1, 0, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0, 0,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [ 0, 0, 0, 0, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0,-1, 0, 0, 0, 0, 0, 0],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1, 0, 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0, 0,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
  ];
}

function createEmptyBoard(width, height) {
	var newBoard = [];
    for (var y = 0; y < height; y++) {
	  newBoard.push([]);
	  for (var x = 0; x < width; x++) {
		  newBoard[y].push(0);
	  }
	}
	return newBoard;
}

function copyBoardContents(fromBoard, toBoard) {
	var minHeight = fromBoard.length > toBoard.length ? toBoard.length : fromBoard.length;
	var minWidth = fromBoard[0].length > toBoard[0].length ? toBoard[0].length : fromBoard[0].length;
    for (var y = 0; y < minHeight; y++) {
	  for (var x = 0; x < minWidth; x++) {
		  toBoard[y][x] = fromBoard[y][x];
	  }
	}
}

function changeBoardSize(newWidth, newHeight) {
	var newBoard = createEmptyBoard(newWidth, newHeight);
	copyBoardContents(board, newBoard);
	board = newBoard;
	calculateLimits();
	onResize();
}

function resetSnake() {
  return [
    {
      x: 23,
      y: 18,
	  segDirection: 'left',
	  size: 1
    },
    {
      x: 24,
      y: 18,
	  segDirection: 'left',
	  size: 1
    },
    {
      x: 25,
      y: 18,
	  segDirection: 'left',
	  size: 1.2
    },
    {
      x: 26,
      y: 18,
	  segDirection: 'left',
	  size: 1
    }
  ];
}

function updateSizeTextBoxes() {
	widthTextBox.value = board[0].length;
	heightTextBox.value = board.length;
}

/**
 * Sets up our game. Stores a reference to the canvas, sets up key listening, and starts our game loop.
 */
function onLoad() {
  // Setup our game loop to listen for a change every 16 milliseconds.
  window.setInterval(gameLoop, 16);

  // We draw via the canvas's 2d context, so we store a reference for drawing.
  var canvasElement = document.getElementById("canvas");
  canvas = canvasElement.getContext("2d");
  //canvas.imageSmoothingEnabled = false;
  canvas.imageSmoothingQuality = "high";
  headImage = document.getElementById("head_piece_left");
  openMouthImage = document.getElementById("open_mouth_piece");
  bodyImage = document.getElementById("body_piece");
  tailImage = document.getElementById("tail_piece");
  boardImage = document.getElementById("wall_piece");
  appleImage = document.getElementById("apple_piece");
  floorImage = document.getElementById("floor_piece");
  
  widthTextBox = document.getElementById("width");

  widthTextBox.addEventListener("keydown", function(event) {
	  if (e.keyCode == 13) {
		  changeBoardSize(widthTextBox.value, board.length);
	  }
  })
  
  widthTextBox.addEventListener("change", function(event) {
	 changeBoardSize(widthTextBox.value, board.length);
  });

  heightTextBox = document.getElementById("height");
  
  heightTextBox.addEventListener("keydown", function(event) {
	  if (e.keyCode == 13) {
		  changeBoardSize(board[0].length, widthTextBox.value);
	  }
  })

  heightTextBox.addEventListener("change", function(event) {
	 changeBoardSize(board[0].length, widthTextBox.value);
  });

  document.getElementById("decrease_x").addEventListener("click", function(event) {
	  changeBoardSize(board[0].length - 1, board.length);
	  updateSizeTextBoxes();
  });

  document.getElementById("increase_x").addEventListener("click", function(event) {
	  changeBoardSize(board[0].length + 1, board.length);
	  updateSizeTextBoxes();
  });
  
  document.getElementById("decrease_y").addEventListener("click", function(event) {
	  changeBoardSize(board[0].length, board.length - 1);
	  updateSizeTextBoxes();
  });

  document.getElementById("increase_y").addEventListener("click", function(event) {
	  changeBoardSize(board[0].length, board.length + 1);
	  updateSizeTextBoxes();
  });
  
  document.getElementById("clear_map").addEventListener("click", function(event) {
	  board = createEmptyBoard(board[0].length, board.length);
  });
  
  document.getElementById("map_code_button").addEventListener("click", function(event) {
	  document.getElementById("map_code").value = encodeMap(board);
  });

  document.getElementById("map_load_button").addEventListener("click", function(event) {
	  board = decodeMap(document.getElementById("map_code").value);
	  onResize();
  });

  // Every time a key is pressed, store it to be processed in the game loop.
  document.addEventListener('keydown', function (event) {
    playerKeyPress = event.keyCode;
	
	if (event.key == 'e') {
		if (editLevel) {
			document.getElementById("level_edit_div").style = "display: none";
		} else {
			document.getElementById("level_edit_div").style = "";
		}
		editLevel = !editLevel;
	}
  });
  
  document.getElementById("level_edit_div").style = "display: none";

  // Make sure to set the key press to false when it's done being "pressed".
  document.addEventListener('keyup', function (event) {
    playerKeyPress = 0;
  });
    
  var mouseHandler = {
	  
	  mouseButtonHeld: false,
	  
	  mouseMoved: false,
	  
	  wasBlankSpace: false,
	  
	  mouseDown: function (event) {
		this.mouseButtonHeld = true;
		  
		var x = Math.floor(event.offsetX / (8 * currentZoom));
		var y = Math.floor(event.offsetY / (8 * currentZoom));
		 
		this.wasBlankSpace = board[y][x] == -1;
	  },
	  
	  mouseUp : function(event) {
	    this.mouseButtonHeld = false;  
	  },
	  
	  mouseMove: function (event) {
		  if(editLevel && this.mouseButtonHeld) {
			var x = Math.floor(event.offsetX / (8 * currentZoom));
			var y = Math.floor(event.offsetY / (8 * currentZoom));
			
			board[y][x] = this.wasBlankSpace ? 0 : -1;
			
			this.mouseMoved = true
		  }
	  },
	  
	  mouseClick: function (event) {
		if(editLevel && !this.mouseMoved) {
			 var x = Math.floor(event.offsetX / (8 * currentZoom));
			 var y = Math.floor(event.offsetY / (8 * currentZoom));
			 
			 board[y][x] = board[y][x] == 0 ? -1 : 0;
		}

		this.mouseMoved = false;
	  }
  }
  
	  canvasElement.addEventListener('mousedown', mouseHandler.mouseDown.bind(mouseHandler));
	  canvasElement.addEventListener('mouseup', mouseHandler.mouseUp.bind(mouseHandler));
	  canvasElement.addEventListener('mousemove', mouseHandler.mouseMove.bind(mouseHandler));  
	  canvasElement.addEventListener('click', mouseHandler.mouseClick.bind(mouseHandler));

  // Setup a new game.
  board = decodeMap(MAZE_LEVEL); //getNewBoard();

  snake = resetSnake();
  
  calculateLimits();
  
  // Get a random apple position.
  newAppleLocation();
  // Reset our gameOver flag.
  gameOver = false;
  
  onResize();
  
  updateSizeTextBoxes();
}

function calculateLimits() {
  // Calculate the walls of the board.
  topLimit = 0;
  bottomLimit = board.length - 1;
  leftLimit = 0;
  rightLimit = board[0].length - 1;
}

function onResize() {
	var boardWidth = board[0].length * 8;
	var boardHeight = board.length * 8;
	
	canvas.canvas.width = boardWidth;
	canvas.canvas.height = boardHeight;
	
	var screenWidth = window.visualViewport.width;
	var screenHeight = window.visualViewport.height;
	
	var widthRatio = screenWidth / boardWidth;
	var heightRatio = screenHeight / boardHeight;

	currentZoom = (widthRatio > heightRatio ? heightRatio : widthRatio) * 0.9;
	
	canvas.canvas.style["zoom"] = (currentZoom * 100) + "%";
 }

/**
 * Sets up a new game by initializing all of the game state variables.
 */
function newGame() {
  // Create and assign a new board.
  board = getNewBoard();
  // Reset snake.
  snake = resetSnake();
  // Reset our gameOver flag.
  gameOver = false;
}

/**
 * The heart of the game, the game loop calls functions to handle inputs, control game state and draw the game.
 */
function gameLoop() {
  // If our game isn't over, figure out what the next move is.
  if (!gameOver) {
	if (!editLevel) {
		handleInput();
    }
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
  
  snake[0].segDirection = lastSnakeDirection;

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
  drawArray(board, 0, 0);

  if (!editLevel) {
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
}

/*
 * Draws a two dimensional array such as the board or a piece.
 */
function drawArray(drawArray, xOffset, yOffset) {
  for (var x = 0; x < drawArray[0].length; x++) {
    for (var y = 0; y < drawArray.length; y++) {
      var value = drawArray[y][x];
      var image;
      if (value == 0) {
        image = floorImage;
      }
      if (value == -1) {
        image = boardImage;
      }
      canvas.drawImage(image, (x + xOffset) * 8, (y + yOffset) * 8);
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
	var lastSegDirection = snake[snake.length - 1].segDirection;
	var lastSnakeSize = snake[snake.length - 1].size;

    for (var x = snake.length - 1; x >= 1; x --) {
      snake[x].x = snake[x - 1].x;
      snake[x].y = snake[x - 1].y;
	  snake[x].segDirection = snake[x - 1].segDirection;
    }

    // Check to see if we're growing.
    if (checkAppleEaten(xDelta, yDelta)) {
      snake.push({
        x: lastSegmentX,
        y: lastSegmentY,
		segDirection: lastSegDirection,
		size: lastSnakeSize > 1 ? 1 : 1.2 
      });
	  
	  framesPerDrop = ((framesPerDrop - 1) < 8) ? 8 : framesPerDrop - 1;
    }
  }
}

/**
 * Checks the position of our snake's head and the apple, returns TRUE if they're at the same position.
 */
function checkAppleEaten(xDelta, yDelta) {
  // Check to see if we're growing.
  if (checkAppleOverlap(snake[0].x + xDelta, snake[0].y + yDelta)) {
    newAppleLocation();
    return true;
  }
  return false;
}

function checkAppleOverlap(xPos, yPos) {
	return xPos == applePosition.x && yPos == applePosition.y;
}

/**
 * Add the new player piece to its spot on the board.
 * Checks for what direction the snake is heading, and changing the image of the snake's head.
 */
function applySnakeHeadToBoard() {
  for (var x = 0; x < snake.length; x ++) {

	var image;
    if (x == 0) {
	  image = headImage;
		if (snake[x].segDirection == "left" && checkAppleOverlap(snake[x].x - 1, snake[x].y)) {
			image = openMouthImage;
		} else if (snake[x].segDirection == "right"  && checkAppleOverlap(snake[x].x + 1, snake[x].y)) {
			image = openMouthImage;
		} else if (snake[x].segDirection == "up"  && checkAppleOverlap(snake[x].x, snake[x].y - 1)) {
			image = openMouthImage;
		} else if (snake[x].segDirection == "down"  && checkAppleOverlap(snake[x].x, snake[x].y + 1)) {
			image = openMouthImage;
		}
    } else if (x == (snake.length - 1)) {
	  image = tailImage;
    } else {
	  image = bodyImage;
	}
	
	var xDelta = 0;
	var yDelta = 0;
	
	var angle = 0;
	var mirror = false;
	if (snake[x].segDirection == "left") {
	  xDelta = frameCount / framesPerDrop * -8;
	} else if (snake[x].segDirection == "right") {
	  xDelta = frameCount / framesPerDrop * 8;
	  mirror = true;
    } else if (snake[x].segDirection == "up") {
	  yDelta = frameCount / framesPerDrop * -8;
	  angle = 90;
    } else if (snake[x].segDirection == "down") {
	  yDelta = frameCount / framesPerDrop * 8;
	  angle = 270;
    }

	if (x == 0 || x == (snake.length - 1)) {
	  size = 1;
    } else {
	  size = ((snake[x].size > 1) ? -sizeModifier : sizeModifier) + snake[x].size;
	}
	
	drawImage(image, snake[x].x * 8 + xDelta, snake[x].y * 8 + yDelta, angle, mirror, size)
  }
  
  sizeModifier += sizeModifierDelta;
  if (sizeModifier > 0.2 || sizeModifier < 0) {
	sizeModifierDelta = -sizeModifierDelta;
  }
}

function drawImage(image, xPos, yPos, angle, mirrorX, scale) {
	canvas.translate(xPos + (image.width / 2), yPos + (image.height / 2));
	
	canvas.rotate(angle * Math.PI / 180);
	
	if (mirrorX) {
	  canvas.scale(-scale, scale);
	} else {
	  canvas.scale(scale, scale);
	}

    canvas.drawImage(image, -4, -4);

	canvas.setTransform(1, 0, 0, 1, 0, 0);
}

function encodeMap(map) {
  var stringContents = "";
  var bit = 1;
  var value = 0;
  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[0].length; x++) {
		if (map[y][x] == -1) {
			value += bit;
		}

		bit = bit << 1;
		if (bit == 16) {
			stringContents += getHexFromNibble(value);
			bit = 1;
			value = 0;
		}	
    }
  }
  
  if (value != 0) {
	  stringContents += getHexFromNibble(value);
  }
  
  return "X[" + map[0].length + "]Y[" + map.length + "]:" + stringContents;
}

function getHexFromNibble(value) {
	return value.toString(16);
}

function getNibbleFromHex(hexChar) {
	return Number.parseInt("0x" + hexChar, 16);
}

function decodeMap(mapString) {
	var newMap = [[]];
	
	var widthString = mapString.indexOf("X[") + 2;
	var width = Number.parseInt(mapString.substr(widthString, 2), 10);
	
	var heightString = mapString.indexOf("Y[") + 2;
	var height = Number.parseInt(mapString.substr(heightString, 2), 10);
	
	var totalBits = width * height;

	var startIndex = mapString.indexOf(":") + 1;
	
	var x = 0;
	var y = 0;
	for (var index = startIndex; index < mapString.length; index ++) {
		var value = getNibbleFromHex(mapString[index]);
		for (var bit = 1; bit < 16;) {
			if (value & bit) {
				newMap[y].push(-1);
			} else {
				newMap[y].push(0);
			}

			bit = bit << 1;

			x ++;
			if (x >= width) {
				x = 0;
				y ++;

				if (y >= height) {
					return newMap;
				}

				newMap.push([]);
			}
		}
	}
	
	return newMap;
}



/**
 * Add the new player piece to its spot on the board.
 */
function applyAppleToBoard() {
  drawImage(appleImage, applePosition.x * 8, applePosition.y * 8, 45 - 450 * sizeModifier, false, 1 + Math.abs(0.3 - sizeModifier * 3));
}

/**
 * Generate a random position for the apple and make sure it doesn't conflict with any walls or snake segments.
 */
function newAppleLocation() {
  var newX = randInt(leftLimit, rightLimit);
  var newY = randInt(topLimit, bottomLimit);
  while (snakeIntersect(newX, newY) || wallIntersect(newX, newY)) {
    newX = randInt(leftLimit, rightLimit);
    newY = randInt(topLimit, bottomLimit);
  }
  applePosition.x = newX;
  applePosition.y = newY;
}

function randInt(lower, upper) {
	return Math.round(Math.random() * (upper - lower)) + lower;
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
    if (snakeIntersect(newX, newY) || wallIntersect(newX,newY)) {
      gameOver = true;
    }
  }
}

function wallIntersect(xPos, yPos) {
	return board[yPos][xPos] == -1;
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