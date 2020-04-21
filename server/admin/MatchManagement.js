const { Game, gameState } = require("../engine/Game.js");
const matchNotFound = { info: "", message: "Match not found" };

class MatchManager {

	constructor() {
		this.onGoingMatchesByID = new Map();
		this.publicMatches = new Map();
		this.privateMatches = new Map();
		this.numberInMatch = new Map();
	}

	getGame(matchID) {
		if (!(this.onGoingMatchesByID.has(matchID))) {
			//throw exception
		}
		return this.onGoingMatchesByID.get(matchID);
	}

	createMatch(hostID, public) {
		let game = new Game();
		game.setHost(hostID);
		let d = new Date();
		let matchID = d.getTime() + "-" + hostID;
		if (public==true) {
			this.publicMatches.set(matchID, game);
		} else {
			this.privateMatches.set(matchID, game);
		}
		this.numberInMatch.set(matchID, 1);
		console.log("Created game " + matchID);
		console.log("Create game " + this.onGoingMatchesByID.get(matchID));
		console.log(this.getMatchInfo(matchID));
		return { matchID: matchID };
	}

	//Create match with id of time + host id.
	createMatch(hostID) {
		this.createMatch(hostID, true);
	}

	//Match info
	getMatchInfo(matchID) {
		const game = this.getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		const info = game.getBoardInfo();
		const state = game.getState();
		const RS = game.getRedSpy();
		const RF = game.getRedField();
		const BS = game.getBlueSpy();
		const BF = game.getBlueField();
		const host = game.getHost();
		const numGuess = game.getnumGuess()
		return { info, RS, RF, BS, BF, Host: host, state, numGuess };
	}

	//Enter the waiting room.
	enterWaitingRoom(matchID) {
		if (!this.numberInMatch.has(matchID)) return { gamestart: false, message: "Match does not exist in waiting stage."}
		let num = this.numberInMatch.get(matchID);
		if (num>=4) return { message: "Match Full" };
		num++;
		return { gamestart: false, message: "Successfully joined match." };
	}

	randomPublicMatch(userID) {
		const size = publicMatches.size;
		if (size == 0) return {message: "No matches made public."}
		const gameArr = Array.from(publicMatches.keys());

		const index = Math.floor(Math.random() * Math.floor(size));
		this.enterWaitingRoom(gameArr(matchID));
		return {matchID: gameArr[index]};
	}

	//Join the user to the match and set the user to the given position.
	joinMatch(matchID, userID, position) {
		let mess = "Space is occupied";
		console.log("Looking for " + matchID);
		console.log("Setting user " + userID);
		let game;
		if (this.privateMatches.has(matchID)) {
			game = privateMatches.get(matchID);
		} else if (this.publicMatches.has(matchID)) {
			game = publicMatches.get(matchID);
		}

		if (game != undefined && game != null) {
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
			} else if (position == "RF") {
				if (game.getRedField() == "") {
					game.setRedField(userID);
					mess = "You are the Red Field Agent";
				}
			}
		} else {
			return {message: matchNotFound};
		}

		if (game.getRedField() != "" && game.getRedSpy() != "" && game.getBlueSpy() != "" && game.getBlueField() != "") {
			return {gamestart: true, info: this.getMatchInfo(matchID), message: mess };
		}
		return {gamestart: false, info: this.getMatchInfo(matchID), message: mess }
		
	}

	//End the match.
	endMatch(matchID) {
		//Store in db and remove from maps.
		let mess = this.onGoingMatchesByID.delete(matchID);

		console.log(mess);
		return { message: "Match deleted" };
	}

	//Remove the player from the match.
	leaveMatch(matchID, userID, position) {
		let game = this.getGame(matchID);
		console.log(game.getRedSpy() + " " + userID);
		if (game == undefined || game == null) return matchNotFound;
		if (game.getBlueField() == userID && position == "BF") {
			game.setBlueField("");
		} else if (game.getBlueSpy() == userID && position == "BS") {
			game.setBlueSpy("");
		} else if (game.getRedField() == userID && position == "RF") {
			game.setRedField("");
		} else if (game.getRedSpy() == userID && position == "RS") {
			game.setRedSpy("");
		}
		console.log(this.getMatchInfo(matchID));
		return { info: this.getMatchInfo(matchID), message: "Left Match" };
	}

	//Reset the match.
	resetMatch(matchID) {
		let game = this.getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		let mess = game.resetMatch();
		console.log(mess);
		return { info: this.getMatchInfo(matchID), message: mess };
	}

	//Spy turn.
	spyCommand(matchID, userID, numGuesses, word) {
		let game = this.getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		let mess = "Move failed";
		if ((
			userID == game.getBlueSpy() &&
			game.getState() == gameState.BLUE_SPY) ||
			(
				userID == game.getRedSpy() &&
				game.getState() == gameState.RED_SPY)) {
			mess = game.nextSpyHint(numGuesses, word);
		}
		return this.getMatchInfo(matchID);
	}

	//Field agent turn.
	fieldGuess(matchID, userID, guess) {
		let game = this.getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		let mess = "";
		if ((
			userID == game.getBlueField() &&
			game.getState() == gameState.BLUE_FIELD) ||
			(
				userID == game.getRedField() &&
				game.getState() == gameState.RED_FIELD)) {
			mess = game.nextWordGuess(guess);
		}
		console.log(mess);
		return { info: this.getMatchInfo(matchID), message: mess };
	}

	//End turn of field agent.
	endTurn(matchID, userID) {
		let game = this.getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		let mess = "";
		if ((
			userID == game.getBlueField() &&
			game.getState() == gameState.BLUE_FIELD) ||
			(
				userID == game.getRedField() &&
				game.getState() == gameState.RED_FIELD)) {
			console.log("Calling end turn in game");
			mess = game.endTurn();
		}
		console.log(mess);
		return { info: this.getMatchInfo(matchID), message: mess };
	}
}


module.exports = new MatchManager();
