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
const STEP_SIZE = 0.5;
var dx = STEP_SIZE;
var dy = -STEP_SIZE;

// ball radius
var ballRadius = 15;
var x = canvas.width/2;
var y = canvas.height-ballRadius*3;

// paddle dimensions
var paddleHeight = ballRadius*2;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) /2

// some funky colours
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


// game state
var GAME_OVER = false;

// rendering engine
function draw() {
    // ball drawing code
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColour;
    ctx.fill();
    ctx.closePath();

    [x,y,dx,dy, ballColour] = moveXY(x,y,dx,dy);

    drawPaddle();
}


function drawPaddle() {
    movePaddle();
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight*2, paddleWidth, paddleHeight);
    ctx.fillStyle = ballColour;
    ctx.fill();
    ctx.closePath();
}

movePaddle = () => {
    rightPressed && paddleX < canvas.width - paddleWidth ? paddleX += 4*STEP_SIZE: null;
    leftPressed && paddleX > 0 ? paddleX -= 4*STEP_SIZE: null;
}


// ball movement and collision detection
moveXY = (x,y, dx, dy) => {
    // hitting sides
    x+ballRadius > canvas.width ? [dx, ballColour] = hitFlatSurface(dx) : null;
    x-ballRadius < 0            ? [dx, ballColour] = hitFlatSurface(dx) : null;

    // hitting ceiling
    y-ballRadius < 0            ? [dy, ballColour] = hitFlatSurface(dy) : null;

    // hittling paddle's flat top surface
    let edge = 1;
    if( y > canvas.height - paddleHeight*2 - ballRadius
            &&
        y < canvas.height - paddleHeight*2 - ballRadius + edge) {
        if(x >= paddleX && x <= paddleX + paddleWidth) {
            y -= edge*2; // this prevents the ball from bouncing up and down along the paddle surface
            [dy, ballColour] = hitFlatSurface(dy);
        }
    }
    
    // Hitting paddle's corners or vertical edges
    //TODO - fancier collision detection

    // hitting floor = GAME OVER!
    if( y+ballRadius > canvas.height) {
        alert("GAME OVER");
        clearInterval(runGame);
        GAME_OVER = true;
        document.location.reload();
    }

    return [x+dx, y+dy, dx, dy, ballColour];
}

hitFlatSurface = (dw) => {
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

// start animating
var runGame = setInterval(draw,1);

// add event listeners for buttons
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
