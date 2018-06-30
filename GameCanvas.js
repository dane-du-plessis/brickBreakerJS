// JavaScript code goes here

console.log("Start...");
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

/*
ctx.beginPath();
ctx.rect(20,40,50,50);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(240, 160, 20, 0, Math.PI*2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.rect(160, 10, 100, 40);
ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
ctx.stroke();
ctx.closePath();
*/

// control variables
var rightPressed = false;
var leftPressed = false;

// game physical constants
var dx = 0.5;
var dy = -0.5;

var x = canvas.width/2;
var y = canvas.height-30;

var rad = 10;

random16bitHexStr = () => {
    let v = Math.floor(Math.random()*256).toString(16);
    v.length < 2 ? v = "0" + v : v = v;
    return v;
}

var colourArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
colourArray = colourArray.map(colour => 
    "#" + random16bitHexStr() + random16bitHexStr() + random16bitHexStr()
);

var ballColour = colourArray[0];

// paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) /2

// game state
var GAME_OVER = false;

// rendering engine
function draw() {
    // ball drawing code
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI*2);
    ctx.fillStyle = ballColour;
    ctx.fill();
    ctx.closePath();

    [x,y,dx,dy, ballColour] = moveXY(x,y,dx,dy);

    drawPaddle();
}


function drawPaddle() {
    // drawing code

    movePaddle();

    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight*2, paddleWidth, paddleHeight);
    ctx.fillStyle = ballColour;
    ctx.fill();
    ctx.closePath();
}


movePaddle = () => {
    rightPressed && paddleX < canvas.width - paddleWidth ? paddleX += 10: null;
    leftPressed && paddleX > 0 ? paddleX -= 10: null;
}


// ball movement and collision detection
moveXY = (x,y, dx, dy) => {
    x+rad > canvas.width ? [dx, ballColour] = hitWall(dx) : null;
    x-rad < 0            ? [dx, ballColour] = hitWall(dx) : null;

    y-rad < 0             ? [dy, ballColour] = hitWall(dy) : null;
    if( y+rad > canvas.height) {
        alert("GAME OVER");
        clearInterval(runGame);
        GAME_OVER = true;
        document.location.reload();
    }

    return [x+dx, y+dy, dx, dy, ballColour];
}

hitWall = (dw) => {
    ballColour = colourArray[Math.floor(Math.random()*colourArray.length)];
    return [-dw, ballColour];
}


// keyboard controls
keyDownHandler = (e) => {
    e.keyCode == 39 ? rightPressed = true : null;
    e.keyCode == 37 ? leftPressed = true : null;
}

keyUpHandler = (e) => {
    e.keyCode == 39 ? rightPressed = false : null;
    e.keyCode == 37 ? leftPressed = false : null;
}


var runGame = setInterval(draw,1);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
