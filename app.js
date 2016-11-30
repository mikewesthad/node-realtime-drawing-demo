/*
	Server - the lazy foreman

	The server doesn't do any drawing itself.  It just relays drawing messages
	between all the connected clients.
*/


// Express server
var express = require("express");
var app = express();

// Serve files in the public folder 
var path = require("path");
var publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Use port 8080 when testing locally, but use the port specified by Heroku
// when deploying
app.set("port", (process.env.PORT || 8080));

// Start the express server and attach the socket connection to it
var server = app.listen(app.get("port"));
var io = require("socket.io")(server);

// Real time communication with socket.io
io.on("connection", function (socket) {

	// This function is called anytime a new client connects. The variable 
	// "socket" is an object that refers to the connection with the new client.
	console.log("Client connected!");

	// When a client draws, notify all other clients
	socket.on("player draw line", function(drawData) {
		// A client has drawn a line in their browser. Relay the message to all 
		// other sockets that are connected. socket.broadcast.emit(...) sends a
		// message to everyone except for whoever the socket is. 
		socket.broadcast.emit("other player draw line", drawData);
	});

	socket.on("disconnect", function() {
		// This is called when the socket is disconnected. You may not need to 
		// use this.
		console.log("Client disconnected!");
	});
});