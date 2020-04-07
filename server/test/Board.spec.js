const GameWord = require("../engine/GameWord.js");
const WordStates = require("../engine/WordStates.js");
const Dictionary = require("../engine/Dictionary");
const Board = require("../engine/Board.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const isNotNull = assert.isNotNull;
const isNotNaN = assert.isNotNaN;
const isDefined = assert.isDefined;
const equal = assert.equal;
const notEqual = assert.notEqual;

chai.should();
chai.use(chaiHttp);

describe('Board', () => {
  
  it ("There should be 1 assassin, 9 red agents, 8 blue agents, and 7 civilians on the board", () => {
	var b = new Board();
	var assassin = 0;
	var red = 0;
	var blue = 0;
	var civ = 0;
	var wl = b.getWords();

	for (var i = 0;i<25;i++) {
		if (wl[i].getPerson() == WordStates.ASSASSIN) {
			assassin++;
		} else if (wl[i].getPerson() == WordStates.RED) {
			red++;
		} else if (wl[i].getPerson() == WordStates.BLUE) {
			blue++;
		} else {
			civ++;
		}
	}

	equal(assassin, 1);
	equal(red, 9);
	equal(blue, 8);
	equal(civ,7);
  });

  it ("There should be no duplicate words on the board", () => {
	var b = new Board();
	var assassin = 0;
	var red = 0;
	var blue = 0;
	var civ = 0;
	var wl = b.getWords();

	var wordMap = {};
	for (var i = 0;i<25;i++) {
		equal(b.getWords()[i] in wordMap, false);
		wordMap[i] = true;
	}
  });

  it ("Word is not being chosen properly", () => {
	var b = new Board();
	var p = b.getWords()[0].getPerson();
	//Should return false because word has not been chosen yet.
	equal(b.getWords()[0].getChosen(), false);
	//Should return true to show that the word has been successfully chosen.
	equal(b.chooseWord(b.getWords()[0]), p);
	//Should return false to show that the word has already been chosen.
	equal(b.chooseWord(b.getWords()[0]), false);
	//Should return true to show that the word has been chosen.
	equal(b.getWords()[0].getChosen(), true);
  });
});