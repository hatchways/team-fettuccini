
const {Game, gameStates} = require("../engine/Game.js");
var matchesByID = new Map();

function getGame(matchID) {
	if (!(matchID in matchesByID)) {
		//throw exception
	}
	return matchesByID.get(matchID);
}

var matchManager = {
	
	createMatch: function(hostID) {
		let g = new Game();
		g.setHost(hostID);
		let d = new Date();
		let matchID = d.getTime()+"_"+hostID;
		matchesByID.set(matchID, g);
		return matchID;
	},

	joinMatch: function (matchID, userID, position) {
		if (!(matchID in matchesByID)) {
			let g = getGame(matchID);
			if (position == "BF") {
				if (g.getBlueField() != "") {
					//return error because space is occupied.
				} else {
					g.setBlueField(userID);
				}
			} else if (position == "BS") {
				if (g.getBlueSpy() != "") {
					//return error
				} else {
					g.setBlueSpy(userID);
				}
			} else if (position == "RS") {
				if (g.getRedSpy() != "") {
					//return error
				} else {
					g.setRedSpy(userID);
				}
			} else if (position == "RF"){
				if (g.getRedField() != "") {
					//return error
				} else {
					g.setRedField(userID);
				}
			} else {
				
			}
			//Return boardInfo
		} else {
			//Return error because match doesn't exist.
		}
	},

	endMatch: function (matchID) {
		//Store in db and remove from maps.

		matchesByID.delete(matchID);
		//Return boardInfo
	},

	leaveMatch: function (matchID, userID) {
		let g = getGame(matchID);
		if (g.getBlueField() == userID) {
			g.setBlueField("");
		} else if (g.getBlueSpy() == userID) {
			g.setBlueSpy("");
		} else if (g.getRedField() == userID) {
			g.setRedField("");
		} else if (g.getRedSpy() == userID) {
			g.setRedSpy("");
		}
		//Return boardInfo
	},

	resetMatch: function (matchID) {
		let g = getGame(matchID);
		g.resetMatch();
		//Return boardInfo
	},

	spyCommand: function (matchID, userID, numGuesses, word) {
		let g = getGame(matchID);
		if ((userID == g.getBlueSpy() && g.getState()==gameStates.BLUE_SPY) || 
		(userID == g.getRedSpy() && g.getState()==gameStates.RED_SPY)) {
			g.nextSpyHint(numGuesses, word);
		} else {
			//return error because it is not this user's turn.
		}
		//Return boardInfo
	},

	fieldGuess: function (matchID, userID, guess) {
		let g = getGame(matchID);
		if ((userID == g.getBlueSpy() && g.getState()==gameStates.BLUE_SPY) || 
		(userID == g.getRedSpy() && g.getState()==gameStates.RED_SPY)) {
			g.nextWordGuess(word);
		} else {
			//return error because it is not this user's turn.
		}
		//Return board info
	},

	endTurn: function(matchID, userID) {
		let g = getGame(matchID);

		if ((userID == g.getBlueSpy() && g.getState()==gameStates.BLUE_SPY) || 
		(userID == g.getRedSpy() && g.getState()==gameStates.RED_SPY)) {
			g.endTurn();
		} else {
			//Return because invalid command.
		}
		//Return board info and game state.
	}
}

module.exports = matchManager;