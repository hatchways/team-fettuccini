
const {Game, gameState} = require("../engine/Game.js");
var matchesByID = new Map();
const matchNotFound = {info: "", message: "Match not found"};
function getGame(matchID) {
	if (!(matchesByID.has(matchID))) {
		//throw exception
	}
	return matchesByID.get(matchID);
}

var matchManager = {
	//Create match with id of time + host id.
	createMatch: function(hostID) {
		let game = new Game();
		game.setHost(hostID);
		let d = new Date();
		let matchID = d.getTime()+"-"+hostID;
		matchesByID.set(matchID, game);
		console.log("Created game "+matchID);
		console.log("Create game "+matchesByID.get(matchID));
		return {matchID: matchID};
	},

	//Match info
	getMatchInfo: function(matchID) {
		let game = getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		let info  = game.getBoardInfo();
		let state = game.getState();
		return {info: info, state: state};
	},
	
	//Join the user to the match and give the user the given position.
	joinMatch: function (matchID, userID, position) {
		let mess = "Space is occupied";
		console.log("Looking for "+matchID);
		console.log(matchesByID.get(matchID));
		if (matchesByID.has(matchID)) {
			let game = getGame(matchID);
			console.log(game);
			if (game == undefined || game == null) return matchNotFound;
			if (position == "BF") {
				if (game.getBlueField() == "") {
					game.setBlueField(userID);
					mess = "You are the Blue Field Agent";
				}
			} else if (position == "BS") {
				if (game.getBlueSpy() == "") {
					game.setBlueSpy(userID);
					mess = "You are the Blue Spy Master";
				}
			} else if (position == "RS") {
				if (game.getRedSpy() == "") {
					game.setRedSpy(userID);
					mess = "You are the Red Spy Master";
				}
			} else if (position == "RF"){
				if (game.getRedField() == "") {
					game.setRedField(userID);
					mess = "You are the Red Field Agent";
				}
			}
		} 
		console.log(mess);
		let retVal = {info: this.getMatchInfo(matchID), message: mess}
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
		let game = getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		if (game.getBlueField() == userID) {
			game.setBlueField("");
		} else if (game.getBlueSpy() == userID) {
			game.setBlueSpy("");
		} else if (game.getRedField() == userID) {
			game.setRedField("");
		} else if (game.getRedSpy() == userID) {
			game.setRedSpy("");
		}
		console.log(mess);
		return {message: "Left Match"};
	},

	//Reset the match.
	resetMatch: function (matchID) {
		let game = getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		let mess = game.resetMatch();
		console.log(mess);
		return {info: this.getMatchInfo(matchID), message: mess};
	},

	//Spy turn.
	spyCommand: function (matchID, userID, numGuesses, word) {
		let game = getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		let mess = "Move failed";
		if ((userID == game.getBlueSpy() && game.getState()==gameState.BLUE_SPY) || 
		(userID == game.getRedSpy() && game.getState()==gameState.RED_SPY)) {
			mess = game.nextSpyHint(numGuesses, word);
		}
		return this.getMatchInfo(matchID);
	},

	//Field agent turn.
	fieldGuess: function (matchID, userID, guess) {
		let game = getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		let mess = "";
		if ((userID == game.getBlueField() && game.getState()==gameState.BLUE_FIELD) || 
		(userID == game.getRedField() && game.getState()==gameState.RED_FIELD)) {
			mess = game.nextWordGuess(guess);
		}
		console.log(mess);
		return {info: this.getMatchInfo(matchID), message: mess};
	},

	//End turn of field agent.
	endTurn: function(matchID, userID) {
		let game = getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		let mess = "";
		if ((userID == game.getBlueField() && game.getState()==gameState.BLUE_FIELD) || 
		(userID == game.getRedField() && game.getState()==gameState.RED_FIELD)) {
			console.log("Calling end turn in game");
			mess = game.endTurn();
		}
		console.log(mess);
		return {info: this.getMatchInfo(matchID), message: mess};
	}
}

module.exports = matchManager;