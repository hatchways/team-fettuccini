const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const isNotNull = assert.isNotNull;
const isNotNaN = assert.isNotNaN;
const isDefined = assert.isDefined;
const equal = assert.equal;
const notEqual = assert.notEqual;
const {Game, gameState} = require("../engine/Game.js");
const GameWord = require("../engine/GameWord.js");
const WordStates = require("../engine/WordStates.js");

chai.should();
chai.use(chaiHttp);


describe('Game', () => {
	var infoObj;
	//Function to return where all red, blue, civilian and assassins are.
  beforeEach(function() {
	//Will run before all tests in this block
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
	infoObj = {g: g, assi: assassinIndex, bi: blueIndices, ri: redIndices, ci:civilianIndices};
  });

  afterEach(function() {
    //Will run after all tests in this block
    delete infoObj;
  });

	//Check that board is initialized
  it("it should have a non-empty board", () => {
	let g = new Game();
	isNotNull(g, 'The board must be initialized when the Game is initialized');
	isNotNaN(g, 'The board must be initialized when the Game is initialized');
	isDefined(g, 'Board must be defined');
  });

  //nextTurn test
  it ("Turn cycle should be RED_SPY->RED_FIELD->BLUE_SPY->BLUE_FIELD", () => {
	  var g = infoObj.g;
	  g.madeGuess = false;
	  equal(g.getState(), gameState.RED_SPY);
	  g.nextTurn();
	  equal(g.getState(), gameState.RED_FIELD);
	  equal(g.madeGuess,false);
	  g.madeGuess = false;
	  g.nextTurn();
	  equal(g.getState(), gameState.BLUE_SPY);
	  equal(g.madeGuess,false);
	  g.madeGuess = true;
	  g.nextTurn();
	  equal(g.getState(), gameState.BLUE_FIELD);
	  equal(g.madeGuess,false);
	  g.madeGuess = true;
	  g.nextTurn();
	  equal(g.getState(), gameState.RED_SPY);
	  equal(g.madeGuess,false);

  });

  it ("Turn cycle should stop when a team has won.", () => {
	  var g = infoObj.g;
	  g.state = gameState.RED_WON;
	  g.nextTurn();
	  equal(g.getState(),gameState.RED_WON);
	  
	  g.state = gameState.BLUE_WON;
	  g.nextTurn();
	  equal(g.getState(),gameState.BLUE_WON);
  });

  //Spy hint tests
  it ("Spy hint not being processed properly for red spymaster", () => {
	
	var g = infoObj.g;
	g.nextSpyHint(1, "hi");
	equal(g.getState(), gameState.RED_FIELD);
	equal(g.numGuessesLeft,1);
	equal(g.spyHint, "hi");
  });

  it ("Spy hint not being processed properly for blue spymaster", () => {
	
	var g = infoObj.g;
	g.state = gameState.BLUE_SPY;
	g.nextSpyHint(1, "hi");
	equal(g.getState(), gameState.BLUE_FIELD);
	equal(g.numGuessesLeft,1);
	equal(g.spyHint, "hi");
  });

  //Check if won tests
  it ("Red should win", () => {
	
	var g = infoObj.g;
	g.redLeft = 0;
	g.checkIfWon();
	equal(g.getState(), gameState.RED_WON);
  });

  it ("Blue should win", () => {
	
	var g = infoObj.g;
	g.blueLeft = 0;
	g.checkIfWon();
	equal(g.getState(), gameState.BLUE_WON);
  });

  it ("Nobody should win yet", () => {
	
	var g = infoObj.g;
	g.redLeft = 9;
	g.blueLeft = 8;
	g.checkIfWon();
	notEqual(g.getState(), gameState.BLUE_WON);
	notEqual(g.getState(), gameState.RED_WON);
  });

  it ("Failing to detect that the game is over when blue wins", () => {
	
	var g = infoObj.g;
	g.state = gameState.BLUE_WON;
	equal(g.isGameOver(), true);
  });

  //Checking if game is over
  it ("Failing to detect that the game is over when red wins", () => {
	
	var g = infoObj.g;
	g.state = gameState.RED_WON;
	equal(g.isGameOver(), true);
  });

  it ("Falsely detecting a winner", () => {
	
	var g = infoObj.g;
	g.state = gameState.RED_SPY;
	equal(g.isGameOver(), false);
	g.state = gameState.RED_FIELD;
	equal(g.isGameOver(), false);
	g.state = gameState.BLUE_SPY;
	equal(g.isGameOver(), false);
	g.state = gameState.BLUE_FIELD;
	equal(g.isGameOver(), false);
  });

  //Voluntarily ending turn of field agent
  it ("Should end turn of RED Field agent", () => {
	
	var g = infoObj.g;
	g.state = gameState.RED_FIELD;
	g.madeGuess = true;
	g.endTurn();
	equal(g.state, gameState.BLUE_SPY);
  });

  it ("Should end turn of BLUE field agent", () => {
	
	var g = infoObj.g;
	g.state = gameState.BLUE_FIELD;
	g.madeGuess = true;
	g.endTurn();
	equal(g.state, gameState.RED_SPY);
  });

  it ("Should not end turn when 0 guesses have been made", () => {
	
	var g = infoObj.g;
	g.state = gameState.BLUE_FIELD;
	g.madeGuess = false;
	g.endTurn();
	equal(g.state, gameState.BLUE_FIELD);
	equal(g.madeGuess, false);
  });

  it ("Should not end turn during SPYMASTER turns", () => {
	
	var g = infoObj.g;
	//Testing with madeGuess = true
	g.state = gameState.BLUE_SPY;
	g.madeGuess = true;
	g.endTurn();
	equal(g.state, gameState.BLUE_SPY);
	equal(g.madeGuess, true);

	g.state = gameState.RED_SPY;
	g.madeGuess = true;
	g.endTurn();
	equal(g.state, gameState.RED_SPY);
	equal(g.madeGuess, true);
	//Testing with madGuess=false
	g.state = gameState.BLUE_SPY;
	g.madeGuess = false;
	g.endTurn();
	equal(g.state, gameState.BLUE_SPY);
	equal(g.madeGuess, false);

	g.state = gameState.RED_SPY;
	g.madeGuess = false;
	g.endTurn();
	equal(g.state, gameState.RED_SPY);
	equal(g.madeGuess, false);
  });

  //Board info.
  it ("Board info needs to return info of all cards on the board", () => {
	
	var g = infoObj.g;
	var words = g.board.get_words();

	//Choose some words.
	words[infoObj.ri[0]].choose();
	words[infoObj.ri[1]].choose();
	words[infoObj.ri[2]].choose();

	words[infoObj.bi[0]].choose();
	words[infoObj.bi[1]].choose();
	words[infoObj.bi[2]].choose();

	words[infoObj.ci[0]].choose();
	words[infoObj.ci[1]].choose();
	words[infoObj.ci[2]].choose();

	words[infoObj.assi].choose();

	var boardValues = g.getBoardInfo();

	var redI = 0;
	var blueI = 0;
	var civI = 0;
	
	//console.log(g.getBoardInfo());
	//Make sure that the board info gets all of the words correctly. Chosen words should return the side (ie, red, blue, etc)
	for (var i = 0;i<boardValues.length;i++)
	{
		//console.log(boardValues[i]+" "+i+" "+infoObj.ri[redI]+" "+infoObj.bi[blueI]+" "+infoObj.ci[civI]+" "+infoObj.assi);
		if (redI<3 && i==infoObj.ri[redI]) {
			equal(boardValues[infoObj.ri[redI]], "_RED");
			redI++;
		} else if (blueI<3 && i==infoObj.bi[blueI]) {
			equal(boardValues[infoObj.bi[blueI]], "_BLUE");
			blueI++;
		} else if (civI<3 &&i==infoObj.ci[civI]) {
			equal(boardValues[infoObj.ci[civI]], "_CIVILIAN");
			civI++;
		} else if (i==infoObj.assi) {
			equal(boardValues[infoObj.assi], "_ASSASSIN");
		} else {
			equal(boardValues[i],words[i].get_val());
		}
	}
  });

  //Reset
  it ("Reset should set the board to its initial state", () => {
	
	var g = infoObj.g;
	g.state = gameState.BLUE_FIELD;
	g.madeGuess = true;
	g.redLeft = 0;
	g.blueLeft = 0;
	g.numGuessesLeft = 1;
	g.spyHint = "hi";
	var temp = g.getBoardInfo();
	g.reset();

	equal(g.state, gameState.RED_SPY);
	equal(g.madeGuess, false);
	equal(g.redLeft, 9);
	equal(g.blueLeft, 8);
	equal(g.numGuessesLeft, 0);
	equal(g.spyHint, "");
	var temp2 = g.getBoardInfo();

	var eq = true;
	for (var i = 0;i<temp.length;i++) {
		if (temp[i] != temp2[i]) {
			eq = false;
			break;
		}
	}
	equal(eq, false);
  });

  //Next Guess
  it ("BLUE should win when RED picks the ASSASSIN", () => {
	
	var g = infoObj.g;
	g.state = gameState.RED_FIELD;
	g.nextWordGuess(infoObj.assi);
	equal(g.getState(), gameState.BLUE_WON);
  });

  it ("RED should win when BLUE picks the ASSASSIN", () => {
	
	var g = infoObj.g;
	g.state = gameState.BLUE_FIELD;
	g.nextWordGuess(infoObj.assi);
	equal(g.getState(), gameState.RED_WON);
  });

  it ("RED FIELD OPERATOR turn should end when BLUE AGENT is picked", () => {
	
	var g = infoObj.g;
	var temp = g.blueLeft;
	g.state = gameState.RED_FIELD;
	g.nextWordGuess(infoObj.bi[0]);
	equal(g.getState(), gameState.BLUE_SPY);
	equal(g.blueLeft, temp-1);
  });

  it ("BLUE FIELD OPERATOR turn should end when RED AGENT is picked", () => {
	
	var g = infoObj.g;
	var temp = g.redLeft;
	g.state = gameState.BLUE_FIELD;
	g.nextWordGuess(infoObj.ri[0]);
	equal(g.getState(), gameState.RED_SPY);
	equal(g.redLeft, temp-1);
  });

  it ("RED FIELD OPERATOR picks a RED AGENT with guesses left. Should decrement number of guesses and stay on same turn", () => {
	
	var g = infoObj.g;
	var temp = g.redLeft;
	g.state = gameState.RED_FIELD;
	g.numGuessesLeft = 2;
	g.nextWordGuess(infoObj.ri[0]);
	equal(g.getState(), gameState.RED_FIELD);
	equal(g.redLeft, temp-1);
  });

  it ("RED FIELD OPERATOR picks the last RED AGENT. RED should win.", () => {
	
	var g = infoObj.g;
	var temp = g.redLeft-1;
	g.state = gameState.RED_FIELD;
	g.numGuessesLeft = g.redLeft;

	for (;temp>=0;temp--) {
		g.nextWordGuess(infoObj.ri[temp]);
		if (temp>0) equal(g.getState(), gameState.RED_FIELD);
		else equal(g.getState(), gameState.RED_WON);
		equal(g.redLeft, temp);
		equal(g.numGuessesLeft, temp);
	}
	equal(g.getState(), gameState.RED_WON);
  });

  it ("RED FIELD OPERATOR picks a RED AGENT and has 0 guesses left. Should go to the next turn.", () => {
	
	var g = infoObj.g;
	var temp = g.redLeft;
	g.state = gameState.RED_FIELD;
	g.numGuessesLeft = 1;
	g.nextWordGuess(infoObj.ri[0]);
	equal(g.getState(), gameState.BLUE_SPY);
	equal(g.redLeft, temp-1);
  });

  it ("BLUE FIELD OPERATOR picks a BLUE AGENT with guesses left. Should decrement number of guesses and stay on same turn", () => {
	
	var g = infoObj.g;
	var temp = g.blueLeft;
	g.state = gameState.BLUE_FIELD;
	g.numGuessesLeft = 2;
	g.nextWordGuess(infoObj.bi[0]);
	equal(g.getState(), gameState.BLUE_FIELD);
	equal(g.blueLeft, temp-1);
  });

  it ("BLUE FIELD OPERATOR picks the last BLUE AGENT. BLUE should win.", () => {
	
	var g = infoObj.g;
	var temp = g.blueLeft-1;
	g.state = gameState.BLUE_FIELD;
	g.numGuessesLeft = g.blueLeft;

	for (;temp>=0;temp--) {
		g.nextWordGuess(infoObj.bi[temp]);
		if (temp>0) equal(g.getState(), gameState.BLUE_FIELD);
		else equal(g.getState(), gameState.BLUE_WON);
		equal(g.blueLeft, temp);
		equal(g.numGuessesLeft, temp);
	}
  });

  it ("BLUE FIELD OPERATOR picks a BLUE AGENT and has 0 guesses left. Should go to the next turn.", () => {
	
	var g = infoObj.g;
	var temp = g.blueLeft;
	g.state = gameState.BLUE_FIELD;
	g.numGuessesLeft = 1;
	g.nextWordGuess(infoObj.bi[0]);
	equal(g.getState(), gameState.RED_SPY);
	equal(g.blueLeft, temp-1);
  });

  it ("BLUE FIELD OPERATOR picks a CIVILIAN with guesses left. Should go to RED SPYMASTER next", () => {
	
	var g = infoObj.g;
	var temp = g.blueLeft;
	g.state = gameState.BLUE_FIELD;
	g.numGuessesLeft = 2;
	g.nextWordGuess(infoObj.ci[0]);
	equal(g.getState(), gameState.RED_SPY);
	equal(g.blueLeft, temp);
  });

  it ("RED FIELD OPERATOR picks a CIVILIAN with guesses left. Should go to BLUE SPYMASTER next", () => {
	
	var g = infoObj.g;
	var temp = g.redLeft;
	g.state = gameState.RED_FIELD;
	g.numGuessesLeft = 2;
	g.nextWordGuess(infoObj.ci[0]);
	equal(g.getState(), gameState.BLUE_SPY);
	equal(g.redLeft, temp);
  });

  it ("Turn cycle should be RED_SPY->RED_FIELD->BLUE_SPY->BLUE_FIELD", () => {
	
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