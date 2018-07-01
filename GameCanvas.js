console.log("Start...");
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// control variables
var rightPressed = false;
var leftPressed = false;

// game physical constants
const STEP_SIZE = 2;
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

// brick variables
var brickRowCount = 2;
var brickColumnCount = 5
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, hitpoints: 1};
    }
}

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
var GAME_WIN  = false;
var PLAYER_SCORE = 0;

// rendering engine
function draw() {
    // ball drawing code
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColour;
    ctx.fill();
    ctx.closePath();
    drawBricks();
    drawPaddle();
    drawScore();
    checkForWin();
    [x,y,dx,dy, ballColour] = moveXY(x,y,dx,dy);
    requestAnimationFrame(draw);
}

function checkForWin() {
    PLAYER_SCORE == brickRowCount*brickColumnCount ?
    GAME_WIN = true: null;
    if(GAME_WIN) {
        // clearInterval(runGame);
        alert("You WON! Well done old chap!");
        document.location.reload();
    }
    
}

function drawBricks() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            var xb = brickOffsetLeft + c * (brickWidth  + brickPadding);
            var yb = brickOffsetTop  + r * (brickHeight + brickPadding);

            bricks[c][r].x = xb;
            bricks[c][r].y = yb;

            if(bricks[c][r].hitpoints) {
                ctx.beginPath();
                ctx.rect(xb,yb, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle() {
    movePaddle();
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight*2, paddleWidth, paddleHeight);
    ctx.fillStyle = ballColour;
    ctx.fill();
    ctx.closePath();

    //add rounded side to left of paddle
    ctx.beginPath();
    ctx.arc(paddleX, 
            canvas.height - paddleHeight*1.5, 
            paddleHeight/2, 
            Math.PI/2, Math.PI*3/2);
    ctx.fillStyle = ballColour;
    ctx.fill();
    ctx.closePath();
    //add rounded side to right of paddle
    ctx.beginPath();
    ctx.arc(paddleX+paddleWidth,
            canvas.height - paddleHeight*1.5, 
            paddleHeight/2, 
            Math.PI*3/2, Math.PI/2);
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
    if( y > canvas.height - paddleHeight*2 - ballRadius) {
        if(x >= paddleX && x <= paddleX + paddleWidth) {
            y = canvas.height - paddleHeight*2 - ballRadius;
            [dy, ballColour] = hitFlatSurface(dy);
        }
    }
    
    // Hitting paddle's rounded sides
    detectEdgeHit();

    // hitting floor = GAME OVER!
    if( y+ballRadius > canvas.height) {
        // clearInterval(runGame);
        alert("GAME OVER");
        GAME_OVER = true;
        document.location.reload();
    }

    // hitting a brick
    dy = brickCollisionDetection(dy);

    return [x+dx, y+dy, dx, dy, ballColour];
}

function detectEdgeHit() {
    // the left and right centers of curvature of the paddle
    xL = paddleX;
    xR = paddleX + paddleWidth;
    yL = canvas.height - paddleHeight*1.5;
    yR = yL;

    // test for collisions on left side
    if(x < paddleX) {
        console.log("searching left...");
        if( ( x - xL )**2 + ( y - yL )**2 < (ballRadius + paddleHeight/2)**2 ) {
            // alert("We've been hit captain!");

        }
    }
    // test for collisions on left side
    else if(x > paddleX + paddleWidth) {
            console.log("searching right...");
            if( ( x - xR )**2 + ( y - yR )**2 < (ballRadius + paddleHeight/2)**2 ) {
                // alert("We've been hit captain!");
                
            }
        }
}

hitFlatSurface = (dw) => {
    ballColour = colourArray[Math.floor(Math.random()*colourArray.length)];
    return [-dw, ballColour];
}

brickCollisionDetection = (dy) => {
    //console.log("checking brick collisions");
    bricks.forEach(c => {
        c.forEach(r =>{
            r.hitpoints > 0 &&
            r.x < x && x < r.x + brickWidth &&
            r.y < y && y < r.y + brickHeight
            ? (dy = -dy, r.hitpoints--, PLAYER_SCORE++)
            : null;
        })
    })
    return dy;
}

function drawScore() {
    ctx.font = "16px Courier";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+PLAYER_SCORE, 8, 20);
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
// var runGame = setInterval(draw,1);
draw();

// add event listeners for buttons
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
