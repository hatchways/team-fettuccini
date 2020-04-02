const GameWord = require("./GameWord.js");
const word_state = require("./WordStates.js");
const Dictionary = require("./Dictionary");

class Board {

	constructor() {
		this.word_list = new Array(25);
		var i = 0;
		var dictSize = Dictionary.length;
		var wordMap = {};
		var red = 9;
		var blue = 8;
		var civilian = 7;
		var assassin = 1;
		for (i = 0;i<25;i++)
		{
			var word;
			do
			{
				var randInt = Math.floor(Math.random() * dictSize);
				word = Dictionary[randInt];
			} while (word in wordMap);
			wordMap[word] = true;
			var randInt = Math.floor(Math.random()*(25-i));
			this.state = word_state.RED;
			if (randInt>=red) {
				if (randInt>=red+blue) {
					if (randInt>=red+blue+civilian) {
						this.state = word_state.ASSASSIN;
						assassin--;
					} else {
						this.state = word_state.CIVILIAN;
						civilian--;
					}
				} else {
					this.state = word_state.BLUE;
					blue--;
				}
			} else {
				red--;
			}
			this.word_list[i]=new GameWord(word, this.state);
			console.log("Created new word for board "+word+" "+this.state+ " index " + i);
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