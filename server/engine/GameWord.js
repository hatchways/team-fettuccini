const word_state = require("./WordStates.js");

class GameWord {
	constructor(word, side) {
		this.val = word;
		this.person = side;
		this.chosen = false;
	}

	get_val() {
		return this.val;
	}

	get_person() {
		return this.person;
	}

	get_chosen() {
		return this.chosen;
	}

	choose() {
		if (this.chosen = true) {
			return false;
		}
		chosen = true;
		return true;
	}
}

module.exports = GameWord;