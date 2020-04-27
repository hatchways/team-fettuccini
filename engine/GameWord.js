const WordStates = require("./WordStates.js.js");

class GameWord {
	constructor(word, side) {
		this.val = word;
		this.person = side;
		//Variable to determine if the word has been picked.
		this.chosen = false;
	}

	getVal() {
		return this.val;
	}

	getPerson() {
		return this.person;
	}

	getChosen() {
		return this.chosen;
	}

	choose() {
		if (this.chosen) {
			return false;
		}
		this.chosen = true;
		return true;
	}
}

module.exports = GameWord;
