// Get the canvas element and its 2D context
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Variables to control the ball's position and movement
var x = canvas.width / 2; // ball's x position
var y = canvas.height - 30; // ball's y position
var dx = 0; // ball's x velocity
var dy = 0; // ball's y velocity
var ballRadius = 10; // ball's radius

// Variables to control the paddle's position and size
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

// Variables to track arrow key presses
var rightPressed = false;
var leftPressed = false;

// Variables for brick grid
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// Game state
var gameStarted = false;

// Array of rainbow colors for the bricks
var colors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8F00FF"];

// Initialize brick objects in a 2D array
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, color: colors[Math.floor(Math.random() * colors.length)] };
    }
}

// Event listeners for key press/release and click
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Add timer display variable
var timerDisplay = document.querySelector("#navbar .time");

// Variables for time tracking
var startTime, endTime, elapsedTime;

// Game End Images
const imageUrlRedX = 'images/red.png';
const imageUrlGreenCheck = 'images/green.png';


// Functions to handle key press/release
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    
    if ((e.key === " " || e.key === "Spacebar") && !gameStarted) {
        e.preventDefault(); // Prevent default spacebar behavior (scrolling)
        startGame(e);
    }
}


function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function startGame(e) {
    gameStarted = true;
    dx = 2;
    dy = -2;
    startTime = Date.now(); // Start the timer
}



// Function to draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    ctx.closePath();
}

// Function to draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    ctx.closePath();
}

// Function to draw the bricks
function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#00FF00";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Function to handle collision detection
function collisionDetection() {
    var allBricksCleared = true; // Track if all bricks have been cleared
  
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status === 1) {
                allBricksCleared = false; // If we find a brick that's still there, not all bricks have been cleared
  
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }
  
    if (allBricksCleared) {
        endTime = Date.now(); // Stop the timer
        elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds
  
        // Display congratulations message
        showCongratulations(elapsedTime);
  
        clearInterval(interval); // Stop game loop
    }
}


// Function to update the game at each frame
function draw() {
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
    ctx.strokeStyle = "#00FF00";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) dx = -dx; // ball collision with left/right wall
  if (y + dy < ballRadius) dy = -dy; // ball collision with top wall

    // The game over condition
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) dy = -dy; // ball collision with paddle
        else {
            // Display game over message with a delay
            setTimeout(function() {
                showGameOver();
                clearInterval(interval); // Stop the game loop
            }, 500);
        }
    }

    // Move the paddle
    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
    else if (leftPressed && paddleX > 0) paddleX -= 7;

    // Move the ball
    if (!gameStarted) {
        x = paddleX + paddleWidth / 2; // keep the ball centered on the paddle
    } else {
        x += dx;
        y += dy;
    }

    // Update timer display
    if (gameStarted) {
        var currentTime = Date.now();
        var currentElapsed = (currentTime - startTime) / 1000;
        timerDisplay.textContent = currentElapsed.toFixed(2) + " seconds";
    }
}

// Function to display the congratulations message
function showCongratulations(elapsedTime) {
    clearInterval(interval); // Stop the game loop

    var canvas = document.getElementById("gameCanvas");
    var emoji = document.createElement("img");
    emoji.src = "images/green.png";
    emoji.style.width = "480px";
    emoji.style.height = "480px";
    emoji.style.display = "block";
    emoji.style.margin = "0 auto";
    canvas.replaceWith(emoji);

    var popup = document.createElement("div");
    popup.className = "popup";

    var message = document.createElement("p");
    message.textContent = "CONGRATS!\nTime: " + elapsedTime.toFixed(2);
    popup.appendChild(message);

    var postScoreButton = document.createElement("button");
    postScoreButton.textContent = "Post!";
    postScoreButton.addEventListener("click", function() {
        submitScore();
    });
    popup.appendChild(postScoreButton);

    var restartButton = document.createElement("button");
    restartButton.textContent = "Restart!";
    restartButton.addEventListener("click", function() {
        location.reload();
    });
    popup.appendChild(restartButton);

    document.getElementById("popupContainer").appendChild(popup);
}



   
// Function to display the game over message
function showGameOver() {
    clearInterval(interval); // Stop the game loop

    var canvas = document.getElementById("gameCanvas");
    var emoji = document.createElement("img");
    emoji.src = "images/red.png";
    emoji.style.width = "480px";
    emoji.style.height = "480px";
    emoji.style.display = "block";
    emoji.style.margin = "0 auto";
    canvas.replaceWith(emoji);

    var popup = document.createElement("div");
    popup.className = "popup";

    var gameOverText = document.createElement("p");
    gameOverText.textContent = "GAME OVER";
    popup.appendChild(gameOverText);

    var restartButton = document.createElement("button");
    restartButton.textContent = "Restart!";
    restartButton.addEventListener("click", function() {
        location.reload();
    });
    popup.appendChild(restartButton);

    document.getElementById("popupContainer").appendChild(popup);
}



// Start the game loop
var interval = setInterval(draw, 10);
