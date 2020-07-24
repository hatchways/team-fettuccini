const Board = require("./Board.js");
const GameWord = require("./GameWord.js");
const WordStates = require("./WordStates.js");
const fs = require("fs");
const {app, io} = require("../app.js");

var gameState = {
	BLUE_WON: "Blue won",
	RED_WON: "Red won",
	RED_SPY: "Red Spy's turn",
	RED_FIELD: "Red Field Operator's turn",
	BLUE_SPY: "Blue Spy's turn",
	BLUE_FIELD: "Blue Field's turn"
}

class Game {

	constructor(matchID) {
		this.matchID = matchID;
		this.sockets = new Map();
		this.state = gameState.RED_SPY;
		this.redLeft = 9;
		this.blueLeft = 8;
		this.numGuessesLeft = 0;
		this.spyHint = "";
		this.madeGuess = false;
		this.hostID = "";
		var text = fs.readFileSync("engine/engmix.txt");
		const dictArr = text.toString().split("\n");
		this.dict = new Set(dictArr);
		this.turnInterval = null;
		this.redSpy = {};
		this.blueSpy = {};
		this.redField = {};
		this.blueField = {};
		this.chatHistory = [];
		this.board = new Board();
		this.matchHistory = [];
		this.addState();
	}

	addState() {
		const board = this.getBoardInfo(true);
		const st = {
				turn: this.state,
				redLeft: this.redLeft,
				blueLeft: this.blueLeft,
				numGuessesLeft: this.numGuessesLeft,
				spyHint: this.spyHint,
				words: board.board,
				factions: board.factions
		}
		this.matchHistory.push(JSON.stringify(st));
	}
	
	setHost(id) {
		this.hostID = "";
	}

	getHost() {
		return this.hostID;
	}
	getChatHistory() {
		return this.chatHistory
	}

	setRedSpy(id, name, socketID) {
		this.redSpy = { id, name };
		if (socketID != undefined) this.sockets.set(id, socketID);
	}

	getRedSpy() {
		return this.redSpy;
	}

	setRedField(id, name, socketID) {
		this.redField = { id, name };
		if (socketID != undefined) this.sockets.set(id, socketID);
	}

	getRedField() {
		return this.redField;
	}

	setBlueSpy(id, name, socketID) {
		this.blueSpy = { id, name };
		if (socketID != undefined) this.sockets.set(id, socketID);
	}

	getBlueSpy() {
		return this.blueSpy;
	}

	setBlueField(id, name, socketID) {
		this.blueField = { id, name };
		if (socketID != undefined) this.sockets.set(id, socketID);
	}

	getBlueField() {
		return this.blueField;
	}

	getSocket(userID) {
		return this.sockets.get(userID);
	}
	
	//Function to restart game.
	reset() {
		this.state = gameState.RED_SPY;
		this.redLeft = 9;
		this.blueLeft = 8;
		this.numGuessesLeft = 0;
		this.spyHint = "";
		this.madeGuess = false;
		this.turnId = (new Date()).toUTCString();
		this.turnInterval = setInterval(async () => {
			this.nextTurn(true);
			this.timeOut();
		}, 60 * 1000);
		this.matchHistory = [];
		this.board = new Board();
		this.addState();
	}

	timeOut() {
		console.log("in Timeout");
		io.in(this.matchID+"_FieldAgent").emit('needToUpdate', {});
		io.in(this.matchID+"_SpyMaster").emit('needToUpdate', {});
	}
	
	//Function to get state of the board to be sent to front end.
	getBoardInfo(spyView) {
		const words = this.board.getWords();
		let boardValues = new Array(25);
		let factionValues = new Array(25);
		for (var i = 0; i < 25; i++) {
			var gWord = words[i];
			if (gWord.getChosen()) {
				var person = gWord.getPerson();
				if (person == WordStates.ASSASSIN) {
					boardValues[i] = "_ASSASSIN";
				} else if (person == WordStates.BLUE) {
					boardValues[i] = "_BLUE";
				} else if (person == WordStates.RED) {
					boardValues[i] = "_RED";
				} else {
					boardValues[i] = "_CIVILIAN";
				}
			} else {
				boardValues[i] = gWord.getVal();
			}
			if (spyView) factionValues[i] = gWord.getPerson();
			else factionValues[i] = "UNKNOWN";
		}
		return { board: boardValues, factions: factionValues };
		//return boardValues;
	}

	getNumGuess() {
		return this.numGuessesLeft
	}
	getState() {
		return this.state;
	}

	getRedLeft() {
		return this.redLeft;
	}

	getBlueLeft() {
		return this.blueLeft;
	}

	getSpyHint() {
		return this.spyHint;
	}

	getGuessesLeft() {
		return this.numGuessesLeft;
	}

	//Cycle through the turns
	nextTurn(turnTimedOut) {
		this.checkIfWon();
		if (this.isGameOver()) return;
		switch (this.state) {
			case gameState.RED_SPY:
				if (turnTimedOut) {
					this.numGuessesLeft = 1;
				}
				console.log("Red Field Agent next")
				this.state = gameState.RED_FIELD;
				break;
			case gameState.RED_FIELD:
				if (turnTimedOut && !this.madeGuess) {
					this.forceWordGuess();
				}
				if (!this.isGameOver()) {
					console.log("Blue SpyMaster next")
					this.spyHint = "";
					this.numGuessesLeft = 0;
					this.state = gameState.BLUE_SPY;
				}
				break;
			case gameState.BLUE_SPY:
				if (turnTimedOut) {
					this.numGuessesLeft = 1;
				}
				console.log("Blue Field Agent next");
				this.state = gameState.BLUE_FIELD;
				break;
			case gameState.BLUE_FIELD:
				if (turnTimedOut && !this.madeGuess) {
					this.forceWordGuess();
				}
				if (!this.isGameOver()) {
					console.log("Red SpyMaster next");
					this.spyHint = "";
					this.numGuessesLeft = 0;
					this.state = gameState.RED_SPY;
				}
				break;
		}

		this.madeGuess = false;
		this.turnId = (new Date()).toUTCString();
		clearInterval(this.turnInterval);
		this.turnInterval = setInterval(async () => {
			this.nextTurn(true);
			this.timeOut();
		}, 60 * 1000);
		this.addState();
		return this.state;
	}

	//End turn if the Field operator has made at least one guess.
	endTurn() {
		if (this.state == gameState.BLUE_SPY || this.state == gameState.RED_SPY) {
			console.log("Can't end turn during a Spy Master move");
			return "Can't End Spy turn";
		}
		if (!this.madeGuess) {
			console.log("Have to make at least one guess for a turn");
			return "Have to make at least one guess for a turn";
		}
		this.madeGuess = false;
		return this.nextTurn();
	}

	forceWordGuess() {
		const remainingWords = this.board.getWords().filter(word => !word.chosen);
		const index = Math.floor(Math.random() * Math.floor(remainingWords.length));
		remainingWords[index].choose();
		this.processWordGuess(remainingWords[index].person);
	}

	processWordGuess(person) {
		if (person == WordStates.ASSASSIN) {
			console.log("Assassin Hit");
			//When a field agent hits an assassin, the other team wins.
			if (this.state == gameState.RED_FIELD) {
				this.state = gameState.BLUE_WON;
				console.log("Blue wins");
			} else {
				this.state = gameState.RED_WON;
				console.log("Red wins");
			}
		} else if (person == WordStates.BLUE) {
			this.blueLeft--;
			console.log("Blue Agent hit");
			//Turn ends when red field agent hits blue target
			if (this.state == gameState.RED_FIELD) {
				return true;
			} else if (this.state == gameState.BLUE_FIELD) {
				//If the blue agent hit the blue target, decrement the number of guesses left for blue field agent.
				this.numGuessesLeft--;
				console.log(this.numGuessesLeft + " guesses left");
				console.log(this.blueLeft + " blue left");
				//Go to next turn if there are no guesses left.
				if (this.numGuessesLeft == 0) return true;
			}
			this.checkIfWon();
		} else if (person == WordStates.RED) {
			this.redLeft--;
			console.log("Red Agent hit");
			//Turn ends when a blue field agent hits red target.
			if (this.state == gameState.BLUE_FIELD) {
				return true;
			} else if (this.state == gameState.RED_FIELD) {
				//If the blue agent hit the blue target, decrement the number of guesses left for blue field agent.
				this.numGuessesLeft--;
				console.log(this.numGuessesLeft + " guesses left");
				console.log(this.blueLeft + " red left");
				//Go to next turn if there are no guesses left.
				if (this.numGuessesLeft == 0) return true;
			}
			this.checkIfWon();
		} else {
			//Go to the next turn if a civilian is hit.
			console.log("Civilian hit");
			return true;
		}
		return false;
	}

	//Guess the next word given the index of the word to be chosen.
	nextWordGuess(wordNum) {
		const word = this.board.getWords()[wordNum];
		if (this.isGameOver()) {
			console.log("The game is over.");
			return;
		}
		if (this.state == gameState.RED_SPY || this.state == gameState.BLUE_SPY) {
			console.log("It is the field operators turn.");
			return;
		}

		//Check if the word has already been chosen.
		const person = this.board.chooseWord(word);
		if (!person) {
			console.log("The word " + word + " has already been chosen");
			return;
		}
		//At least one guess has been made.
		this.madeGuess = true;
		const turnEnded = this.processWordGuess(person);
		this.addState();
		if (turnEnded) {
			return this.nextTurn();
		}
	}

	validWord(word) {
		const words = this.board.getWords();
		for (let i = 0; i < words.length; i++) {
			const val = words[i].getVal();
			if (val.includes(word)) {
				console.log("Hint can not be a substring of word that exists on board");
				return false;
			} else if (word.includes(val) || val == word) {
				console.log("Hint can not be a superstring of word that exists on board");
				return false;
			}
		}
		return true;
	}

	//Function for processing a spies hint. Takes in number of words that are related and the word hint itself as parameters.
	nextSpyHint(guesses, word, name) {
		if (this.isGameOver()) return;
		if (this.state == gameState.RED_FIELD || this.state == gameState.BLUE_FIELD) {
			console.log("It is the spy masters turn.");
			return;
		}

		console.log("New Spy Hint is " + word + " for " + guesses);
		this.chatHistory.push({
			role: this.state === gameState.RED_SPY ? "RS" : "BS",
			name,
			text: `${guesses} - ${word}`
		})
		this.spyHint = word;
		this.numGuessesLeft = parseInt(guesses) + 1;
		let n = this.nextTurn();
		console.log(n);
		return this.getBoardInfo(true);
	}

	agentChat(role, name, text) {
		this.chatHistory.push({ role, name, text })
		return this.getBoardInfo();
	}

	//Check if a team has won and change the state accordingly.
	checkIfWon() {
		if (this.redLeft == 0) {
			console.log("Red Won");
			this.state = gameState.RED_WON;
		}
		else if (this.blueLeft == 0) {
			console.log("Blue Won");
			this.state = gameState.BLUE_WON;
		}
	}

	//Check if the game is over.
	isGameOver() {
		if (this.state == gameState.RED_WON || this.state == gameState.BLUE_WON) {
			console.log("The game has ended");
			return true;
		}
		return false;
	}

	getWinner() {
		if (this.state == gameState.RED_WON) {
			return "Red";
		}
		if (this.state == gameState.BLUE_WON) {
			return "Blue";
		}
		return "";
	}
	
	getHistory() {
		return this.matchHistory;
	}
}

module.exports = { Game, gameState };
