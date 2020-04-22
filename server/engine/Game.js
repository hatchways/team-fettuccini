const Board = require("./Board.js");
const GameWord = require("./GameWord.js");
const WordStates = require("./WordStates.js");

var gameState = {
	BLUE_WON: "Blue won",
	RED_WON: "Red won",
	RED_SPY: "Red Spy's turn",
	RED_FIELD: "Red Field Operator's turn",
	BLUE_SPY: "Blue Spy's turn",
	BLUE_FIELD: "Blue Field's turn"
}

class Game {

	constructor() {
		this.state = gameState.RED_SPY;
		this.board = null;
		this.redLeft = 0;
		this.blueLeft = 0;
		this.numGuessesLeft = 0;
		this.spyHint = "";
		this.madeGuess = false;
		this.hostID = "";
		this.redSpy = "";
		this.blueSpy = "";
		this.redField = "";
		this.blueField = "";
		this.chatHistory = [];
		this.reset();
	}

	setHost(id) {
		this.hostID = "";
	}

	getnumGuess() {
		return this.numGuessesLeft;
	}
	getHost() {
		return this.hostID;
	}
	getChatHistory() {
		return this.chatHistory
	}

	setRedSpy(id) {
		this.redSpy = id;
	}

	getRedSpy() {
		return this.redSpy;
	}

	setRedField(id) {
		this.redField = id;
	}

	getRedField() {
		return this.redField;
	}

	setBlueSpy(id) {
		this.blueSpy = id;
	}

	getBlueSpy() {
		return this.blueSpy;
	}

	setBlueField(id) {
		this.blueField = id;
	}

	getBlueField() {
		return this.blueField;
	}

	//Function to restart game.
	reset() {
		this.state = gameState.RED_SPY;
		this.board = new Board();
		this.redLeft = 9;
		this.blueLeft = 8;
		this.numGuessesLeft = 0;
		this.spyHint = "";
		this.madeGuess = false;
	}

	//Function to get state of the board to be sent to front end.
	getBoardInfo() {
		const words = this.board.getWords();
		let boardValues = new Array(25);
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
		}
		return boardValues;
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
		return this.guesses;
	}

	//Cycle through the turns
	nextTurn() {
		this.checkIfWon();
		this.madeGuess = false;
		if (this.isGameOver()) return;
		switch (this.state) {
			case gameState.RED_SPY:
				console.log("Red Field Agent next")
				this.state = gameState.RED_FIELD;
				break;
			case gameState.RED_FIELD:
				console.log("Blue SpyMaster next")
				this.spyHint = "";
				this.guesses = 0;
				this.state = gameState.BLUE_SPY;
				break;
			case gameState.BLUE_SPY:
				console.log("Blue Field Agent next");
				this.state = gameState.BLUE_FIELD;
				break;
			case gameState.BLUE_FIELD:
				console.log("Red SpyMaster next");
				this.spyHint = "";
				this.guesses = 0;
				this.state = gameState.RED_SPY;
				break;
		}
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
				return this.nextTurn();
			} else if (this.state == gameState.BLUE_FIELD) {
				//If the blue agent hit the blue target, decrement the number of guesses left for blue field agent.
				this.numGuessesLeft--;
				console.log(this.numGuessesLeft + " guesses left");
				console.log(this.blueLeft + " blue left");
				this.checkIfWon();
				//Go to next turn if there are no guesses left.
				if (this.numGuessesLeft == 0) return this.nextTurn();
			}
		} else if (person == WordStates.RED) {
			this.redLeft--;
			console.log("Red Agent hit");
			//Turn ends when a blue field agent hits red target.
			if (this.state == gameState.BLUE_FIELD) {
				return this.nextTurn();
			} else if (this.state == gameState.RED_FIELD) {
				//If the blue agent hit the blue target, decrement the number of guesses left for blue field agent.
				this.numGuessesLeft--;
				console.log(this.numGuessesLeft + " guesses left");
				console.log(this.blueLeft + " red left");
				this.checkIfWon();
				//Go to next turn if there are no guesses left.
				if (this.numGuessesLeft == 0) return this.nextTurn();
			}
		} else {
			//Go to the next turn if a civilian is hit.
			console.log("Civilian hit");
			return this.nextTurn();
		}
	}

	//Function for processing a spies hint. Takes in number of words that are related and the word hint itself as parameters.
	nextSpyHint(guesses, word) {
		if (this.isGameOver()) return;
		if (this.state == gameState.RED_FIELD || this.state == gameState.BLUE_FIELD) {
			console.log("It is the spy masters turn.");
			return;
		}
		console.log("New Spy Hint is " + word + " for " + guesses);
		this.chatHistory.push({
			player: this.state === gameState.RED_SPY ? "RS" : "BS",
			text: `${guesses} - ${word}`
		})
		this.spyHint = word;
		this.numGuessesLeft = guesses;
		let n = this.nextTurn();
		console.log(n);
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
}

module.exports = { Game, gameState };
