// Initialise variables
let snake = [{ x: 100, y: 100 }];
let score = 0;
let newDirection = false;

let apple_x;
let apple_y;

let badApple_x;
let badApple_y;

let dx = 20;
let dy = 0;

// Game board set up
const canvas = document.querySelector("canvas");
const playButton = document.getElementById("press-play");
const ctx = canvas.getContext("2d");

// Start game
playButton.addEventListener("click", function () {
  document.querySelector(".snakeboard").style.display = "none";
  canvas.style.border = "1px solid lightblue";
  if (gameOver()) {
    location.reload();
  }
  draw();
  generateApple();
  document.addEventListener("keydown", controlSnake);
});

// Game loop
function draw() {
  console.log(badApple_x, badApple_y, snake[0].x, snake[0].y);

  if (gameOver()) {
    document.removeEventListener("keydown", controlSnake);
    playButton.innerHTML = "clear game";
    ctx.font = "36px serif";
    ctx.fillText("game over :(", canvas.height / 3, canvas.height / 2);
    return;
  }

  newDirection = false;

  setTimeout(function onTick() {
    clearBoard();
    if (snake.length % 3 == 0) {
      drawApple();
      drawRottenApple();
    } else {
      drawApple();
      clearBadApple();
    }
    snake.forEach(drawSnakeSegment);
    moveSnake();
    draw();
  }, 100);
}

function clearBoard() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(apple_x, apple_y, 20, 20);
}

function drawRottenApple() {
  ctx.fillStyle = "purple";
  ctx.fillRect(badApple_x, badApple_y, 20, 20);
}

function drawSnakeSegment(snakeSegment) {
  ctx.fillStyle = "green";
  ctx.strokestyle = "darkgreen";
  ctx.fillRect(snakeSegment.x, snakeSegment.y, 20, 20);
  ctx.strokeRect(snakeSegment.x, snakeSegment.y, 20, 20);
}

function gameOver() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }

  if (crashIntoWall()) return true;

  const eatBadApple = snake[0].x === badApple_x && snake[0].y === badApple_y;
  if (eatBadApple) return true;
}

function crashIntoWall() {
  const crashLeft = snake[0].x < 0;
  const crashRight = snake[0].x > canvas.width - 20;
  const crashUp = snake[0].y < 0;
  const crashDown = snake[0].y > canvas.height - 20;
  return crashLeft || crashRight || crashUp || crashDown;
}

function nextApple(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 20) * 20;
}

function generateApple() {
  if (snake.length % 3 === 0) {
    badApple_x = nextApple(0, canvas.width - 20);
    badApple_y = nextApple(0, canvas.height - 20);
  }
  apple_x = nextApple(0, canvas.width - 20);
  apple_y = nextApple(0, canvas.height - 20);

  snake.forEach(function checkAppleCollision(segment) {
    const appleCollision = segment.x == apple_x && segment.y == apple_y;
    const badAppleCollision =
      segment.x == badApple_x && segment.y == badApple_y;
    if (appleCollision || badAppleCollision) generateApple();
  });
}

function clearBadApple() {
  badApple_x = null;
  badApple_y = null;
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  const eatApple = snake[0].x === apple_x && snake[0].y === apple_y;
  if (eatApple) {
    score += 1;
    document.getElementById("score").innerHTML = score;
    generateApple();
  } else {
    snake.pop();
  }
}

function controlSnake(e) {
  const arrowLeft = 37;
  const arrowRight = 39;
  const arrowUp = 38;
  const arrowDown = 40;

  if (newDirection) return;
  newDirection = true;

  const goingUp = dy === -20;
  const goingDown = dy === 20;
  const goingRight = dx === 20;
  const goingLeft = dx === -20;

  if (e.keyCode === arrowLeft && !goingRight) {
    dx = -20;
    dy = 0;
  }
  if (e.keyCode === arrowUp && !goingDown) {
    dx = 0;
    dy = -20;
  }
  if (e.keyCode === arrowRight && !goingLeft) {
    dx = 20;
    dy = 0;
  }
  if (e.keyCode === arrowDown && !goingUp) {
    dx = 0;
    dy = 20;
  }
}
