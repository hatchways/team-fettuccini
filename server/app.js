const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connectDB = require("./db");
const cors = require("cors");

const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");
const usersRouter = require("./routes/users");
const matchHistoryRouter = require("./routes/matchHistory");
const MatchManager = require("./admin/MatchManagement");

const { json, urlencoded } = express;

const { Game, gameState } = require("./engine/Game.js");
const readline = require("readline");

var app = express();
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
io.on('connection', function(socket) {
	console.log("made socket connection "+ socket.id);
	
	socket.on('changePosition', function(data) {
		/*res = await fetchUtil({
	        url: `/matches/${matchId}/${action}`,
	        method: "POST",
	        body: {
	          userID: userId,
	          name,
	          position
	        }
	      })*/
		console.log("HELLO");
		const matchID = data.matchID;
		const userID = data.userID;
		const name = data.name;
		const position = data.position;
		const action = data.action;
		
		//Put the player in the match at the given position.
		try {
			console.log("In socket func");
			let payload;
			if (action=="joinmatch") payload = MatchManager.joinMatch(matchID, userID, position, name);
			else payload = MatchManager.leaveMatch(matchID, userID, position);
			console.log("Called MatchManager In socket func");
			io.sockets.emit('changePosition', payload);
			
		} catch (err) {
			console.error(err.message);
		}
	})
	
	socket.on('updateState', function(data) {
		const matchID = data.matchID
		const userID = data.userID
		
		const gameState = {info: MatchManager.getMatchInfo(matchID, userID), mess: "update"}
		let match = MatchManager.getGame(matchID);
		gameState.blueScore = 8 - match.blueLeft;
		gameState.redScore = 9 - match.redLeft;
		gameState.isOver = match.isGameOver();
		gameState.winner = match.getWinner();
		gameState.turnId = match.turnId;
		io.sockets.emit('updateState', gameState);
	})
	
	socket.on('nextMove', function(data) {
		
		const { userID, position, move, name, role, turnId, matchID } = data;
		
		let gameState = {};
		//Check who is sending the move (spy master or field agent) and call appropriate method.
		if (position == "RF" || position == "BF") {
			if (move == "_END") {
				//console.log("calling end turn in match manager");
				gameState = MatchManager.endTurn(matchID, userID, turnId);
			} else gameState = MatchManager.fieldGuess(matchID, userID, move, turnId);
		} else if (position == "BS" || position == "RS") {
			let num = move.substr(0, move.indexOf(' '));
			let word = move.substr(move.indexOf(' ') + 1);
			//console.log("calling spycommand in match manager");
			gameState = MatchManager.spyCommand(matchID, userID, num, word, turnId, name);
		} else if (position === "_CHAT") {
			gameState = MatchManager.spyCommand(matchID, userID, 1, move, turnId, name, role)
		} else {
			gameState = MatchManager.getMatchInfo(matchID, userID);
		}
		console.log("bye");

		//add properties to gameState
		let match = MatchManager.getGame(matchID);
		gameState.blueScore = 8 - match.blueLeft;
		gameState.redScore = 9 - match.redLeft;
		gameState.isOver = match.isGameOver();
		gameState.winner = match.getWinner();
		gameState.turnId = match.turnId;
		console.log("Game State");
		console.log(gameState);
		io.sockets.emit('updateState', gameState);
	})
	
	
});



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








module.exports = app;
