/* eslint-disable complexity */
/* eslint-disable max-statements */
const { Game, gameState } = require("../engine/Game.js");
const matchNotFound = { info: "", RS: "", RF: "", BS: "", BF: "", message: "Match not found" };
const turnExpired = { info: "", RS: "", RF: "", BS: "", BF: "", message: "Turn expired" };
const Match = require("../models/match");
const User = require("../models/user");
const mongoose = require('mongoose');

class MatchManager {
	constructor() {
		this.onGoingMatchesByID = new Map();
		this.publicMatches = new Map();
		this.privateMatches = new Map();
		this.numberInMatch = new Map();
	}

	getGame(matchID) {
		if (this.onGoingMatchesByID.has(matchID)) return this.onGoingMatchesByID.get(matchID);
		if (this.publicMatches.has(matchID)) return this.publicMatches.get(matchID);
		if (this.privateMatches.has(matchID)) return this.privateMatches.get(matchID);
		return undefined;
	}

	createMatch(hostID, pub) {
		let matchID = mongoose.Types.ObjectId().toString();
		let game = new Game(matchID);
		game.init();
		game.setHost(hostID);
		if (pub == "true") {
			console.log("Creating public match");
			this.publicMatches.set(matchID, game);
		} else {
			this.privateMatches.set(matchID, game);
		}
		this.numberInMatch.set(matchID, 1);
		console.log("Created game " + matchID);
		console.log(this.getMatchInfo(matchID, hostID));
		return { matchID: matchID };
	}

	//Match info
	getMatchInfo(matchID, userID) {
		const game = this.getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		const state = game.getState();
		const RS = game.getRedSpy();
		const RF = game.getRedField();
		const BS = game.getBlueSpy();
		const BF = game.getBlueField();
		const Host = game.getHost();
		const numGuess = game.getNumGuess();
		const chatHistory = game.getChatHistory()
		let info;
		if (userID == RS.id || userID == BS.id) info = game.getBoardInfo(true);
		else info = game.getBoardInfo(false);
		return { info, RS, RF, BS, BF, Host, state, numGuess, chatHistory };
	}

	//Enter the waiting room.
	enterWaitingRoom(matchID) {
		if (!this.numberInMatch.has(matchID)) return { gamestart: false, message: "Match does not exist in waiting stage." }
		let num = this.numberInMatch.get(matchID);
		if (num >= 4) return { message: "Match Full" };
		num++;
		return { gamestart: false, message: "Successfully joined match." };
	}

	randomPublicMatch() {
		const size = this.publicMatches.size;
		if (size == 0) return { message: "No matches made public." }
		const gameArr = Array.from(this.publicMatches.keys());

		const index = Math.floor(Math.random() * Math.floor(size));
		const game = gameArr[index]
		this.enterWaitingRoom(game);
		return { matchID: game };
	}

	playerInGame(game, userID) {
		if (game.getBlueField().id == userID || game.getBlueSpy().id == userID
			|| game.getRedField().id == userID || game.getRedSpy().id == userID) {
			return true;
		}
		return false;
	}

	//Join the user to the match and set the user to the given position.
	joinMatch(matchID, userID, position, name, socketID) {
		let mess = "Space is occupied";
		console.log("Looking for " + matchID);
		console.log("Setting user " + userID);
		let game;
		if (this.privateMatches.has(matchID)) {
			game = this.privateMatches.get(matchID);
		} else if (this.publicMatches.has(matchID)) {
			game = this.publicMatches.get(matchID);
		}
		console.log("hello " + game);
		if (game != undefined && game != null) {
			console.log("Player in game ", this.playerInGame(game, userID));
			if (this.playerInGame(game, userID)) return { gamestart: false, info: this.getMatchInfo(matchID, userID), message: "This player has already selected a role." };
			console.log(position);
			if (position == "BF") {
				console.log("here" + game.getBlueField().id);
				if (game.getBlueField().id == "" || Object.keys(game.getBlueField()).length === 0) {
					game.setBlueField(userID, name, socketID);
					mess = "You are the Blue Field Agent";
				}
			} else if (position == "BS") {
				console.log("here" + game.getBlueSpy().id);
				if (game.getBlueSpy().id == "" || Object.keys(game.getBlueSpy()).length === 0) {
					game.setBlueSpy(userID, name, socketID);
					mess = "You are the Blue Spy Master";
				}
			} else if (position == "RS") {
				console.log("here" + game.getRedSpy().id);
				if (game.getRedSpy().id == "" || Object.keys(game.getRedSpy()).length === 0) {
					console.log("hello");
					game.setRedSpy(userID, name, socketID);
					mess = "You are the Red Spy Master";
				}
			} else if (position == "RF") {
				console.log("here" + game.getRedField().id);
				if (game.getRedField().id == "" || Object.keys(game.getRedField()).length === 0) {
					game.setRedField(userID, name, socketID);
					mess = "You are the Red Field Agent";
				}
			}
		} else {
			return { message: matchNotFound };
		}

		if (game.getRedField().id && game.getRedSpy().id && game.getBlueSpy().id && game.getBlueField().id) {
			game.reset();
			return { gamestart: true, info: this.getMatchInfo(matchID, userID), message: mess };
		}

		return { gamestart: false, info: this.getMatchInfo(matchID, userID), message: mess }
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
		console.log(game.getRedSpy().id + " " + userID);
		if (game == undefined || game == null) return matchNotFound;
		if (game.getBlueField().id == userID && position == "BF") {
			game.setBlueField("", "");
		} else if (game.getBlueSpy().id == userID && position == "BS") {
			game.setBlueSpy("", "");
		} else if (game.getRedField().id == userID && position == "RF") {
			game.setRedField("", "");
		} else if (game.getRedSpy().id == userID && position == "RS") {
			game.setRedSpy("", "");
		}
		game.sockets.remove(userID);
		console.log(this.getMatchInfo(matchID, userID));
		return { info: this.getMatchInfo(matchID, userID), message: "Left Match" };
	}

	//Reset the match.
	resetMatch(matchID, userID) {
		let game = this.getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		let mess = game.resetMatch();
		console.log(mess);
		return { info: this.getMatchInfo(matchID, userID), message: mess };
	}

	//Spy turn.
	spyCommand(matchID, userID, numGuesses, word, turnId, name = "", role = "") {
		let game = this.getGame(matchID);
		console.log("numGuess in spy command " + numGuesses);
		if (game == undefined || game == null) return matchNotFound;
		console.log("turnId comparison")
		console.log(game.turnId + " "+turnId)
		if (game.turnId != turnId) return turnExpired;

		let mess = "Move failed";

		console.log("HELLLOOOOOO!!!!!!!!");


		if ((userID == game.getBlueSpy().id && game.getState() == gameState.BLUE_SPY) ||
			(userID == game.getRedSpy().id && game.getState() == gameState.RED_SPY)) {
			if (!game.dict.has(word)) {
				console.log(word + " is not a real word");
			} else if (!game.validWord(word)) {
				console.log(word + " is a substring or superstring of a word that exists on board.");
			} else {
				mess = game.nextSpyHint(numGuesses, word, name);
			}
		} else if (!["BS", "RS"].includes(role)) {
			mess = game.agentChat(role, name, word)
		}
		return {info: this.getMatchInfo(matchID, userID), message: "Spy command"};
	}

	//Field agent turn.
	fieldGuess(matchID, userID, guess, turnId) {
		let game = this.getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		if (game.turnId != turnId) return turnExpired;

		let mess = "";
		if ((
			userID == game.getBlueField().id &&
			game.getState() == gameState.BLUE_FIELD) ||
			(
				userID == game.getRedField().id &&
				game.getState() == gameState.RED_FIELD)) {
			mess = game.nextWordGuess(guess);

			if (game.isGameOver()) {
				this.saveMatch(matchID);
			}
		}
		console.log(mess);
		return { info: this.getMatchInfo(matchID, userID), message: mess };
	}

	//End turn of field agent.
	endTurn(matchID, userID, turnId) {
		let game = this.getGame(matchID);
		if (game == undefined || game == null) return matchNotFound;
		if (game.turnId != turnId) return turnExpired;

		let mess = "";
		if ((
			userID == game.getBlueField().id &&
			game.getState() == gameState.BLUE_FIELD) ||
			(
				userID == game.getRedField().id &&
				game.getState() == gameState.RED_FIELD)) {
			console.log("Calling end turn in game");
			mess = game.endTurn();
		}
		console.log(mess);
		return { info: this.getMatchInfo(matchID, userID), message: mess };
	}

	async saveMatch(matchID) {
		console.log("in save match");
		const redBasePoints = 9;
		const blueBasePoints = 8;
		const matchInfo = this.getGame(matchID);
		const words = matchInfo.board.getWords();
		
		const matchWords = [];
		const matchFactions = [];
		for (let i = 0;i<words.length;i++) {
			matchWords.push(words[i].getVal());
			matchFactions.push(words[i].getPerson());
		}
		const winner = matchInfo.getWinner();
		const matchHistory = matchInfo.getHistory();
		console.log(matchInfo.redSpy);
		
		const redSpy = mongoose.Types.ObjectId(matchInfo.redSpy.id);
		const blueSpy = mongoose.Types.ObjectId(matchInfo.blueSpy.id);
		const redField = mongoose.Types.ObjectId(matchInfo.redField.id);
		const blueField = mongoose.Types.ObjectId(matchInfo.blueField.id);
		
		const redSpyRole = "Red spy";
		const redFieldRole = "Red field";
		const blueSpyRole = "Blue spy";
		const blueFieldRole = "Blue field";
		
		const participants = [
			{ user: matchInfo.redSpy && matchInfo.redSpy.id ? redSpy : mongoose.Types.ObjectId(), role: redSpyRole },
			{ user: matchInfo.redField && matchInfo.redField.id ? redField : mongoose.Types.ObjectId(), role: redFieldRole },
			{ user: matchInfo.blueSpy && matchInfo.blueSpy.id ? blueSpy : mongoose.Types.ObjectId(), role: blueSpyRole },
			{ user: matchInfo.blueField && matchInfo.blueField.id ? blueField : mongoose.Types.ObjectId(), role: blueFieldRole }
		];

		// save the match info
		const match = new Match({
			_id: mongoose.Types.ObjectId(matchID),
			matchId: matchID,
			date: Date.now(),
			blueScore: blueBasePoints - matchInfo.blueLeft,
			redScore: redBasePoints - matchInfo.redLeft,
			winner: winner,
			participants: participants,
			history: matchHistory,
			words: matchWords,
			factions: matchFactions,
			RFGuessesCorrect: matchInfo.RFGuessesCorrect,
			RFAssassinHit: matchInfo.RFAssassinHit,
			RFCivilianHit: matchInfo.RFCivilianHit,
			RFOpponentHit: matchInfo.RFOpponentHit,
			BFGuessesCorrect: matchInfo.BFGuessesCorrect,
			BFAssassinHit: matchInfo.BFAssassinHit,
			BFCivilianHit: matchInfo.BFCivilianHit,
			BFOpponentHit: matchInfo.BFOpponentHit,
			RSHintsGiven: matchInfo.RSHintsGiven,
			BSHintsGiven: matchInfo.BSHintsGiven
		});
		match.save(function (error) {
			if (error) {
				console.log("saving data failed.", error);
			} else {
				console.log("saved match");
			}
		});
		
		// update the matchIds of each user
		for (let i = 0; i < participants.length; i++) {
			const userId = participants[i].user.toString();
			const role = participants[i].role;
			if (userId && userId != "") {
				const user = await User.findById(userId);

				if (user != null) {
					if (!user.matchIds) {
						user.matchIds = [];
					}
					
					user.matchIds = user.matchIds.concat(mongoose.Types.ObjectId(matchID));
					if (role == redSpyRole) {
						user.numHints += matchInfo.RSHintsGiven;
						user.assassinsAssists += matchInfo.RFAssassinHit;
						user.civiliansAssists += matchInfo.RFCivilianHit;
						user.opponentsAssists += matchInfo.RFOpponentHit;
						user.correctAssists += matchInfo.RFGuessesCorrect;
						if (winner=="Red") user.numWins += 1;
						else user.numLosses += 1;
					} else if (role == redFieldRole) {
						user.assassinsHits += matchInfo.RFAssassinHit;
						user.civiliansHits += matchInfo.RFCivilianHit;
						user.opponentsHits += matchInfo.RFOpponentHit;
						user.correctHits += matchInfo.RFGuessesCorrect;
						if (winner=="Red") user.numWins += 1;
						else user.numLosses += 1;
					} else if (role == blueSpyRole) {
						user.numHints += matchInfo.BSHintsGiven;
						user.assassinsAssists += matchInfo.BFAssassinHit;
						user.civiliansAssists += matchInfo.BFCivilianHit;
						user.opponentsAssists += matchInfo.BFOpponentHit;
						user.correctAssists += matchInfo.BFGuessesCorrect;
						if (winner=="Blue") user.numWins += 1;
						else user.numLosses += 1;
					} else if (role == blueFieldRole) {
						user.assassinsHits += matchInfo.BFAssassinHit;
						user.civiliansHits += matchInfo.BFCivilianHit;
						user.opponentsHits += matchInfo.BFOpponentHit;
						user.correctHits += matchInfo.BFGuessesCorrect;
						if (winner=="Blue") user.numWins += 1;
						else user.numLosses += 1;
					}
					
					User.findByIdAndUpdate(
						{ _id: userId },
						{ 
							matchIds: user.matchIds,
							numHints: user.numHints,
							assassinsAssists: user.assassinsAssists,
							assassinHits: user.assassinsHits,
							civilianAssists: user.civilianAssists,
							civilianHits: user.civilianHits,
							opponentsAssists: user.opponentsAssists,
							opponentsHits: user.opponentsHits,
							correctAssists: user.correctAssists,
							correctHits: user.correctHits,
							numWins: user.numWins,
							numLosses: user.numLosses,
						},
						function (error) {
							if (error) {
								console.log("updating match id for the user failed.", userId, error);
							}
							else {
								console.log("added match record to user", matchID, userId);
							}
						}
					);
				}
			}
		}
	}
}

module.exports = new MatchManager();
