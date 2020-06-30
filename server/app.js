const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookie = require('cookie');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connectDB = require("./db");
const cors = require("cors");



const { json, urlencoded } = express;

const readline = require("readline");

var app = express();

var http = require("http");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

var socket = require("socket.io");
var io = socket(server);
module.exports = {app, io};
const MatchManager = require("./admin/MatchManagement");

io.on('connection', function(socket) {
	console.log("made socket connection "+ socket.id);
	console.log("cookie: "+socket.handshake.headers.cookie);
	console.log("socket: "+socket.handshake.headers);
	console.log("Cookie");
    
	try {
		const cookies = cookie.parse(socket.handshake.headers.cookie);
	    const token = cookies.token;
	    if (token) {
	    	jwt.verify(token, process.env.JWT_KEY);
	    } else {
	        console.log("Unable to authenticate the client for socket connection");
	        socket.disconnect();
	    }
		
	} catch (err) {
		console.log("Invalid token for socket connection");
		socket.disconnect();
	}
      
	socket.on('disconnect', (data) => {
		console.log("Disconnect ")
		console.log(socket.id)
	})
	socket.on('changePosition', function(data) {
		console.log("HELLO");
		const matchID = data.matchID;
		const userID = data.userID;
		const name = data.name;
		const position = data.position;
		const action = data.action;
		
		//Put the player in the match at the given position.
		try {
			console.log("adding to position "+position);
			let payload;
			socket.join(matchID);
			let posType = "FieldAgent";
			
			if (position == "RS" || position == "BS") posType = "SpyMaster";
			if (action=="joinmatch") {
				payload = MatchManager.joinMatch(matchID, userID, position, name, socket.id);
				socket.join(matchID+"_"+posType);
			} else {
				payload = MatchManager.leaveMatch(matchID, userID, position);
				socket.leave(matchID+"_"+posType);
			}
			console.log("Called MatchManager In socket func");
			io.in(matchID).emit('changePosition', payload);
		} catch (err) {
			console.error(err.message);
		}
	})
	
	socket.on('updateState', function(data) {
		const matchID = data.matchID
		const userID = data.userID
		const updateToEveryone = data.updateToEveryone
		console.log("in update state");
		let g = MatchManager.getGame(matchID)
		if (g==undefined) return;
		const spyUser = g.getRedSpy().id;
		const blueSpy = g.getBlueSpy().id;
		const fieldUser = g.getRedField().id; 
		const blueField = g.getBlueField().id;
		if (userID == spyUser || userID == blueSpy) socket.join(matchID+"_SpyMaster");
		else socket.join(matchID+"_FieldAgent");
		const gameStateSpy = {info: MatchManager.getMatchInfo(matchID, spyUser), mess: "update"}
		const gameStateField = {info: MatchManager.getMatchInfo(matchID, fieldUser), mess: "update"}
		let match = MatchManager.getGame(matchID);
		gameStateSpy.blueScore = 8 - match.blueLeft;
		gameStateSpy.redScore = 9 - match.redLeft;
		gameStateSpy.isOver = match.isGameOver();
		gameStateSpy.winner = match.getWinner();
		gameStateSpy.turnId = match.turnId;
		gameStateField.blueScore = 8 - match.blueLeft;
		gameStateField.redScore = 9 - match.redLeft;
		gameStateField.isOver = match.isGameOver();
		gameStateField.winner = match.getWinner();
		gameStateField.turnId = match.turnId;
		console.log("Emitting from update state");
		console.log(spyUser+" "+userID);
		console.log(spyUser==userID);
		if (updateToEveryone) {
			io.in(matchID+"_FieldAgent").emit('updateState', gameStateField);
			io.in(matchID+"_SpyMaster").emit('updateState', gameStateSpy);
		} else {
			const sock = g.getSocket(userID);
			console.log("socket id "+sock);
			console.log("userID " + userID);
			
			if (spyUser==userID || blueSpy==userID) {
				console.log("Sending to spy");
				socket.emit('updateState', gameStateSpy);
			}
			if (fieldUser==userID || blueField==userID) {
				console.log("Sending to field");
				socket.emit('updateState', gameStateField);
			}
		}
		
		console.log("Emitted from update state");
	})
	
	socket.on('nextMove', function(data) {
		
		const { userID, position, move, name, role, turnId, matchID } = data;
		
		let gameStateSpy = {};
		let gameStateField = {}
		let g = MatchManager.getGame(matchID)
		const spyUser = g.getRedSpy().id;
		const fieldUser = g.getRedField().id; 
		//Check who is sending the move (spy master or field agent) and call appropriate method.
		if (position == "RF" || position == "BF") {
			if (move == "_END") {
				//console.log("calling end turn in match manager");
				gameStateField = MatchManager.endTurn(matchID, userID, turnId);
				gameStateSpy = {info: MatchManager.getMatchInfo(matchID, spyUser), message: "Updated spy view"}
			} else {
				gameStateField = MatchManager.fieldGuess(matchID, userID, move, turnId);
				gameStateSpy = {info: MatchManager.getMatchInfo(matchID, spyUser), message: "Updated spy view"}
			}
		} else if (position == "BS" || position == "RS") {
			let num = move.substr(0, move.indexOf(' '));
			let word = move.substr(move.indexOf(' ') + 1);
			console.log("calling spycommand in match manager");
			gameStateSpy = MatchManager.spyCommand(matchID, userID, num, word, turnId, name);
			gameStateField = {info: MatchManager.getMatchInfo(matchID, fieldUser), message: "Update Field view"}
		} else if (position === "_CHAT") {
			gameStateField = MatchManager.spyCommand(matchID, userID, 1, move, turnId, name, role)
			gameStateSpy = {info: MatchManager.getMatchInfo(matchID, spyUser), message: "Update Spy view"}
		} else {
			gameStateField = {info: MatchManager.getMatchInfo(matchID, fieldUser), message: "Update Field view"};
			gameStateSpy = {info: MatchManager.getMatchInfo(matchID, spyUser), message: "Update Spy view"};
		}
		console.log("bye");

		//add properties to gameState
		let match = MatchManager.getGame(matchID);
		gameStateSpy.blueScore = 8 - match.blueLeft;
		gameStateSpy.redScore = 9 - match.redLeft;
		gameStateSpy.isOver = match.isGameOver();
		gameStateSpy.winner = match.getWinner();
		gameStateSpy.turnId = match.turnId;
		gameStateField.blueScore = 8 - match.blueLeft;
		gameStateField.redScore = 9 - match.redLeft;
		gameStateField.isOver = match.isGameOver();
		gameStateField.winner = match.getWinner();
		gameStateField.turnId = match.turnId;
		console.log("Field response");
		console.log(gameStateField.info.info.factions);
		console.log("Spy response");
		console.log(gameStateSpy.info.info.factions);
		io.in(matchID+"_"+"FieldAgent").emit('updateState', gameStateField);
		io.in(matchID+"_"+"SpyMaster").emit('updateState', gameStateSpy);
	})
});

const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");
const usersRouter = require("./routes/users");
const matchHistoryRouter = require("./routes/matchHistory");
//const profileRouter = require("./routes/users");

app.use(express.json({ extended: false }));
app.get("/", (req, res) => res.send("API Running"));
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));
app.use(cors());

app.use("/users", usersRouter);
app.use("/ping", pingRouter);
app.use("/matches", require("./routes/matches"));
app.use(usersRouter);
app.use("/matchHistory", matchHistoryRouter);
//app.use("/profile", profileRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

connectDB();


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

  console.log("Listening on " + bind);
}

