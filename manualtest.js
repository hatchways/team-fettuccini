const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connectDB = require("./db");

const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");

const { json, urlencoded } = express;

const {Game, gameState} = require("./engine/Game.js");
const readline = require("readline");

var app = express();

let aGame = new Game();
var lastState = gameState.RED_SPY;

function submitMove(answer) {
  //console.log(`--${word}--`);
  if (answer=="_END"){
    aGame.endTurn();
  } else if (answer=="_RESTART") {
    aGame.reset();
    console.log("\n\n\n\n");
  } else if (answer.includes(" ")) {
    var index = answer.indexOf(' ');
    var num = answer.substr(0, index);
    var word = answer.substr(index+1, answer.length);
    aGame.nextSpyHint(num, word);
      console.log("Game state is "+aGame.state);

  } else {
    aGame.nextWordGuess(answer);
  }
}
readline
  .createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })
  .on("line",  submitMove);
console.log("ran more stuff");
/*while (aGame.state != gameState.RED_WON && aGame.state != gameState.BLUE_WON) {
  
  if (aGame.state == gameState.RED_FIELD && aGame.state != lastState) {
    console.log("Red field agent turn: ");
    lastState = gameState.RED_FIELD;
  } else if (aGame.state == gameState.RED_SPY && aGame.state != lastState) {
    console.log("Red Spy Master turn: ");
    lastState = gameState.RED_SPY;
  } else if (aGame.state == gameState.BLUE_FIELD && aGame.state != lastState) {
    console.log("Blue field agent turn: ");
    lastState = gameState.BLUE_FIELD;
  } else if (aGame.state == gameState.BLUE_SPY && aGame.state != lastState) {
    console.log("Blue Spy Master turn: ");
    lastState = gameState.BLUE_SPY;
  }

  const readThis = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
  });

  app.listen(3000, ()=>console.log('server started on port 3000'));
  readThis.question('Enter input', name => {
    console.log(`Hey there ${name}!`);
    readline.close();
  });

  
  
}*/