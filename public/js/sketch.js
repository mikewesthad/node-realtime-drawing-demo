/*
	Client - the workhorse of our app :)

	It handles drawing and passes along messages to the server anytime the user
	draws a line.  It also listens for incoming messages that let it know what
	the other players have drawn.
*/

var socket = io();
var markerColor;

// Listen for a message from the server that a line needs to be drawn
socket.on("other player draw line", function (drawData) {
	drawLine(drawData.color, drawData.p1, drawData.p2);
});

function setup() {
	createCanvas(windowWidth, windowHeight);	
	background(0);

	colorMode(HSB, 360, 100, 100, 1);
	strokeCap(ROUND);

	markerColor = {
		hue: random(0, 360), 
		saturation: 100, 
		brightness: 100
	};
}

function draw() {
	if (mouseIsPressed) {
		// Draw with marker
		if (mouseButton === LEFT) {

			var point1 = {x: pmouseX, y: pmouseY};
			var point2 = {x: mouseX, y: mouseY};

			drawLine(markerColor, point1, point2);

			socket.emit("player draw line", {
				p1: point1,
				p2: point2,
				color: markerColor
			});	
		}
	}
}

// Draw a colored line to the client's screen
function drawLine(lineColor, p1, p2) {
	strokeWeight(10);
	stroke(lineColor.hue, lineColor.saturation, lineColor.brightness);
	line(p1.x, p1.y, p2.x, p2.y);
}