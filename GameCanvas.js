// JavaScript code goes here

console.log(";asdlfkj;lsdfj;s");
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

var dx = 2;
var dy = 2;

var x = canvas.width/2;
var y = canvas.height-30;

var rad = 10;

function draw() {
    // drawing code
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI*2);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
    [x,y,dx,dy] = moveXY(x,y,dx,dy);
    console.log(x,y);
}

moveXY = (x,y, dx, dy) => {
    // ball touching right side?
    x+rad > canvas.width ? dx = -dx : null;
    x-rad < 0            ? dx = -dx : null;

    // Top/bottom touch?
    y+rad < canvas.height ? dy = -dy : null;
    y-rad > 0             ? dy = -dy : null;

    return [x+dx, y+dy, dx, dy];
}

setInterval(draw,5);