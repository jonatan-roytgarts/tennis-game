var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 12;
var ballSpeedY = 12;
const MAX_BOUNCE_ANGLE = Math.PI*5/12;


var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

function calculateMousePosition(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };
}

function handleMouseClick(evt) {
  if(showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}
window.onload = function() {
  console.log("Hello World");
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(function() {
    drawEverything();
    moveEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);
  canvas.addEventListener('mousemove',
    function (evt) {
      var mousePos = calculateMousePosition(evt);
      paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
    });
}

function ballReset() {
  if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballSpeedX = -ballSpeedX;
}
function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if(paddle2YCenter < ballY-35) {
    paddle2Y += 6;
  } else if(paddle2YCenter > ballY+35){
    paddle2Y -= 6;
  }
}
function moveEverything() {
  if(showingWinScreen) {
    return;
  }

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if(ballX > canvas.width - PADDLE_WIDTH) {
    if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.35;
    }
  }

  if(ballX > canvas.width) {
    player1Score++;
    ballReset();
  }

  if(ballX < 0 + PADDLE_WIDTH) {
    if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);

      ballSpeedY = deltaY * 0.15;
    }
  }

  if(ballX < 0) {
    player2Score++;
    ballReset();
  }


  if(ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  if(ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for(var i=0; i < canvas.height; i+=40) {
    colorRect(canvas.width/2-1,i,2,20,'white');
  }
}
function drawEverything() {
  // Draw screen
  colorRect(0,0,canvas.width,canvas.height,'black');

  if(showingWinScreen) {
    canvasContext.fillStyle = 'white';
    if(player1Score >= WINNING_SCORE) {
      canvasContext.fillText("You Won!",355,200);
      canvasContext.fillText("click to continue playing",340,500);
    } else if(player2Score >= WINNING_SCORE) {
      canvasContext.fillText("You lost!",360,200);
      canvasContext.fillText("click to continue playing",340,500);
    }
    return;
  }
  // Draw net
  drawNet();
  // Draw human player paddle
  colorRect(0,paddle1Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');
  // Draw computer player paddle
  colorRect(canvas.width-PADDLE_WIDTH,paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');
  // Draw a red ball
  colorCircle(ballX, ballY, 10, 'red');

  canvasContext.fillStyle = 'white';
  canvasContext.fillText(player1Score,100,100);
  canvasContext.fillText(player2Score,canvas.width-100,100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
  canvasContext.fill();
}

function colorRect(topX, topY, width, hieght, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(topX,topY,width,hieght);
}
