const GameWord = require("./GameWord.js");
const WordStates = require("./WordStates.js");
const Dictionary = require("./Dictionary");

class Board {

	constructor() {
		this.wordList = new Array(25);
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
			//Make sure no word is repeated.
			do
			{
				var randInt = Math.floor(Math.random() * dictSize);
				word = Dictionary[randInt];
			} while (word in wordMap);
			//indicate that the word is being used now.
			wordMap[word] = true;
			//Randomly choose which side to assign the word.
			var randInt = Math.floor(Math.random()*(25-i));
			this.state = WordStates.RED;
			if (randInt>=red) {
				if (randInt>=red+blue) {
					if (randInt>=red+blue+civilian) {
						this.state = WordStates.ASSASSIN;
						assassin--;
					} else {
						this.state = WordStates.CIVILIAN;
						civilian--;
					}
				} else {
					this.state = WordStates.BLUE;
					blue--;
				}
			} else {
				red--;
			}
			//Create the word.
			this.wordList[i]=new GameWord(word, this.state);
			console.log("Created new word for board "+word+" "+this.state+ " index " + i);
		}
	}

	chooseWord(word) {
		//Choose the word if it is not chosen and return true. If it is already chosen, return false.
		if (word.chosen) return false;
		console.log("Choosing word "+word.get_val());
		word.choose();
		return word.get_person();
	}

	get_words() {
		return this.wordList;
	}
}

module.exports = Board;