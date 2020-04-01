const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const isNotNull = assert.isNotNull;
const isNotNaN = assert.isNotNaN;
const isDefined = assert.isDefined;
const equal = assert.equal;
const {Game, gameState} = require("../engine/Game.js");
const GameWord = require("../engine/GameWord.js");
const WordStates = require("../engine/WordStates.js");

chai.should();
chai.use(chaiHttp);

describe('Game', () => {

  function metaGame() {
		var g = new Game();
		var b = g.board;

		var wordList = b.get_words();

		var rIndex = 0;
		var bIndex = 0;
		var cIndex = 0;

		var redIndices = [];
		var blueIndices = [];
		var civilianIndices = [];
		var assassinIndex = -1;

		var i = 0;
		for (i=0;i<wordList.length;i++) {
			var wordObj = wordList[i];
			var word = wordObj.get_val();
			var person = wordObj.get_person();

			if (person == WordStates.BLUE) {
				blueIndices[bIndex] = i;
				bIndex++;
			} else if (person == WordStates.RED) {
				redIndices[rIndex] = i;
				rIndex++;
			} else if (person == WordStates.CIVILIAN) {
				civilianIndices[cIndex] = i;
				cIndex++;
			} else {
				assassinIndex = i;
			}
		}
		var infoObj = {g: g, assi: assassinIndex, bi: blueIndices, ri: redIndices, ci:civilianIndices};
		return infoObj;
	}

  it("it should have a non-empty board", () => {
	let g = new Game();
	isNotNull(g, 'The board must be initialized when the Game is initialized');
	isNotNaN(g, 'The board must be initialized when the Game is initialized');
	isDefined(g, 'Board must be defined');
  });

  it ("Turn cycle should be RED_SPY->RED_FIELD->BLUE_SPY->BLUE_FIELD", () => {
	var infoObj = metaGame();
	var g = infoObj.g;
	equal(g.getState(), gameState.RED_SPY, "First state should be RED SPYMASTER");
	g.nextSpyHint(1, "hi");
	equal(g.getState(), gameState.RED_FIELD, "State should be RED FIELD AGENT's turn");
	g.nextWordGuess(infoObj.ri[0]);
	equal(g.getState(), gameState.BLUE_SPY);
	g.nextSpyHint(1,"bye");
	equal(g.getState(), gameState.BLUE_FIELD);
	g.nextWordGuess(infoObj.bi[0]);
	equal(g.getState(), gameState.RED_SPY);
  });
});