
const {Game, gameState} = require("../engine/Game.js");
var matchesByID = new Map();

function getGame(matchID) {
	if (!(matchesByID.has(matchID))) {
		//throw exception
	}
	return matchesByID.get(matchID);
}

var matchManager = {
	//Create match with id of time + host id.
	createMatch: function(hostID) {
		let g = new Game();
		g.setHost(hostID);
		let d = new Date();
		let matchID = d.getTime()+"_"+hostID;
		matchesByID.set(matchID, g);
		console.log("Created game "+matchID);
		console.log("Create game "+matchesByID.get(matchID));
		return {matchID: matchID};
	},

	//Match info
	matchInfo: function(matchID) {
		let g = getGame(matchID);
		if (g == undefined || g == null) return {info: "", message: "Match not found"};
		let info  = g.getBoardInfo();
		let state = g.getState();
		return {info: info, state: state};
	},
	
	//Join the user to the match and give the user the given position.
	joinMatch: function (matchID, userID, position) {
		let mess = "Space is occupied";
		console.log("Looking for "+matchID);
		console.log(matchesByID.get(matchID));
		if (matchesByID.has(matchID)) {
			let g = getGame(matchID);
			console.log(g);
			if (g == undefined || g == null) return {info: "", message: "Match not found"};
			if (position == "BF") {
				if (g.getBlueField() == "") {
					g.setBlueField(userID);
					mess = "You are the Blue Field Agent";
				}
			} else if (position == "BS") {
				if (g.getBlueSpy() == "") {
					g.setBlueSpy(userID);
					mess = "You are the Blue Spy Master";
				}
			} else if (position == "RS") {
				if (g.getRedSpy() == "") {
					g.setRedSpy(userID);
					mess = "You are the Red Spy Master";
				}
			} else if (position == "RF"){
				if (g.getRedField() == "") {
					g.setRedField(userID);
					mess = "You are the Red Field Agent";
				}
			}
		} 
		console.log(mess);
		let retVal = {info: this.matchInfo(matchID), message: mess}
		console.log("another");
		return retVal;
	},

	//End the match.
	endMatch: function (matchID) {
		//Store in db and remove from maps.
		let mess = matchesByID.delete(matchID);
		console.log(mess);
		return {message: "Match deleted"};
	},

	//Remove the player from the match.
	leaveMatch: function (matchID, userID) {
		let g = getGame(matchID);
		if (g == undefined || g == null) return {info: "", message: "Match not found"};
		if (g.getBlueField() == userID) {
			g.setBlueField("");
		} else if (g.getBlueSpy() == userID) {
			g.setBlueSpy("");
		} else if (g.getRedField() == userID) {
			g.setRedField("");
		} else if (g.getRedSpy() == userID) {
			g.setRedSpy("");
		}
		console.log(mess);
		return {message: "Left Match"};
	},

	//Reset the match.
	resetMatch: function (matchID) {
		let g = getGame(matchID);
		if (g == undefined || g == null) return {info: "", message: "Match not found"};
		let mess = g.resetMatch();
		console.log(mess);
		return {info: this.matchInfo(matchID), message: mess};
	},

	//Spy turn.
	spyCommand: function (matchID, userID, numGuesses, word) {
		let g = getGame(matchID);
		if (g == undefined || g == null) return {info: "", message: "Match not found"};
		let mess = "Move failed";
		if ((userID == g.getBlueSpy() && g.getState()==gameState.BLUE_SPY) || 
		(userID == g.getRedSpy() && g.getState()==gameState.RED_SPY)) {
			mess = g.nextSpyHint(numGuesses, word);
		}
		return this.matchInfo(matchID);
	},

	//Field agent turn.
	fieldGuess: function (matchID, userID, guess) {
		let g = getGame(matchID);
		if (g == undefined || g == null) return {info: "", message: "Match not found"};
		let mess = "";
		if ((userID == g.getBlueField() && g.getState()==gameState.BLUE_FIELD) || 
		(userID == g.getRedField() && g.getState()==gameState.RED_FIELD)) {
			mess = g.nextWordGuess(guess);
		}
		console.log(mess);
		return {info: this.matchInfo(matchID), message: mess};
	},

	//End turn of field agent.
	endTurn: function(matchID, userID) {
		let g = getGame(matchID);
		if (g == undefined || g == null) return {info: "", message: "Match not found"};
		let mess = "";
		if ((userID == g.getBlueField() && g.getState()==gameState.BLUE_FIELD) || 
		(userID == g.getRedField() && g.getState()==gameState.RED_FIELD)) {
			console.log("Calling end turn in game");
			mess = g.endTurn();
		}
		console.log(mess);
		return {info: this.matchInfo(matchID), message: mess};
	}
}

module.exports = matchManager;