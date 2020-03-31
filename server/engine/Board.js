const GameWord = require("./GameWord.js");
const word_state = require("./WordStates.js");

class Board {

	constructor() {
		//TODO create list of 25 words along with the word state.
		this.word_list = new Array(25);
		var i = 0;
		for (i = 0;i<25;i++)
		{
			this.word_list[i]=new GameWord("word"+i, word_state.BLUE);
		}
	}

	chooseWord(word) {
		if (word.chosen) return false;
		console.log("Choosing word "+word.get_val());
		word.choose();
		return word.get_person();
	}

	get_words() {
		return this.word_list;
	}
}

module.exports = Board;