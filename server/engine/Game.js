const Board =  require("./Board.js");
const GameWord = require("./GameWord.js");
const word_state = require("./WordStates.js");

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
		this.reset();
	}

	reset() {
		this.state = gameState.RED_SPY;
		this.board = new Board();
		this.redLeft = 9;
		this.blueLeft = 8;
		this.numGuessesLeft = 0;
		this.spyHint = "";
		this.madeGuess = false;
	}

	getBoardInfo() {
		var words = this.board.get_words();
		var boardValues = new Array(25);
		for (var i = 0;i<25;i++)
		{
			var gWord = words[i];
			if (gWord.get_chosen()) {
				var person = gWord.get_person();
				if (person == word_state.ASSASSIN) {
					boardValues[i] = "_ASSASSIN";
				} else if (person == word_state.BLUE) {
					boardValues[i] = "_BLUE";
				} else if (person == word_state.RED) {
					boardValues[i] = "_RED";
				} else {
					boardValues[i] = "_CIVILIAN";
				}
			} else {
				boardValues[i] = gWord.get_val();
			}
		}
		return boardValues;
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

	nextTurn() {
		this.checkIfWon();
		this.madeGuess = false;
		if (this.isGameOver()) return;
		switch(this.state) {
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

	endTurn() {
		if (this.state == gameState.BLUE_SPY || this.state == gameState.RED_SPY) {
			console.log("Can't end turn during a Spy Master move");
			return;
		}
		if (!this.madeGuess) {
			console.log("Have to make at least one guess for a turn");
			return;
		}
		this.madeGuess = false;
		return this.nextTurn();
	}

	nextWordGuess(wordNum) {
		var word = this.board.get_words()[wordNum];
		if (this.isGameOver()) {
			console.log("The game is over.");
			return;
		}
		if (this.state == gameState.RED_SPY || this.state == gameState.BLUE_SPY) {
			console.log("It is the field operators turn.");
			return;
		}
		var person = this.board.chooseWord(word);
		if (!person) {
			console.log("The word "+word+" has already been chosen");
			return;
		}
		//console.log("Guessing word "+word);
		this.madeGuess = true;
		if (person == word_state.ASSASSIN) {
			console.log("Assassin Hit");
			if (this.state == gameState.RED_FIELD) {
				this.state = gameState.BLUE_WON;
				console.log("Blue wins");
			} else {
				this.state = gameState.RED_WON;
				console.log("Red wins");
			}
		} else if (person == word_state.BLUE) {
			this.blueLeft--;
			console.log("Blue Agent hit");
			if (this.state == gameState.RED_FIELD) {
				return this.nextTurn();
			} else if (this.state == gameState.BLUE_FIELD) {
				this.numGuessesLeft--;
				console.log(this.numGuessesLeft + " guesses left");
				console.log(this.blueLeft+" blue left");
				this.checkIfWon();
				if (this.numGuessesLeft==0) return this.nextTurn();
			}
		} else if (person == word_state.RED) {
			this.redLeft--;
			console.log("Red Agent hit");
			if (this.state == gameState.BLUE_FIELD) {
				return this.nextTurn();
			} else if (this.state == gameState.RED_FIELD) {
				this.numGuessesLeft--;
				console.log(this.numGuessesLeft + " guesses left");
				console.log(this.blueLeft+" red left");
				this.checkIfWon();
				if (this.numGuessesLeft==0) return this.nextTurn();
			}
		} else {
			console.log("Civilian hit");
			return this.nextTurn();
		}
	}

	nextSpyHint(guesses, word) {
		if (this.isGameOver()) return;
		if (this.state == gameState.RED_FIELD || this.state == gameState.BLUE_FIELD) {
			console.log("It is the spy masters turn.");
			return;
		}
		console.log("New Spy Hint is "+word+ " for "+guesses);
		this.spyHint = word;
		this.numGuessesLeft = guesses;
		return this.nextTurn();
	}

	checkIfWon() {
		if (this.redLeft == 0)
		{
			console.log("Red Won");
			this.state = gameState.RED_WON;
		} 
		else if (this.blueLeft == 0) 
		{
			console.log("Blue Won");
			this.state = gameState.BLUE_WON;
		}
	}

	isGameOver() {
		if (this.state == gameState.RED_WON || this.state == gameState.BLUE_WON) {
			console.log("The game has ended");
			return true;
		}
		return false;
	}
}

module.exports = {Game, gameState};