/* eslint-disable complexity */
const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const MatchManager = require('../admin/MatchManagement.js');

router.post("/creatematch",
	[
		check('hostID', "No host id provided").not().isEmpty(),
		check('isPublic', "isPublic required").not().isEmpty(),
		check('isPublic', "Invalid isPublic").isIn(["true", "false"])
	],
	function (req, res, next) {
		console.log("hello");
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { hostID, isPublic } = req.body;

		try {
			let gameID = MatchManager.createMatch(hostID, isPublic);
			res.json(gameID);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	});

router.post("/:matchid/leavematch",
	[
		check('userID', 'User ID is required').not().isEmpty(),
		check('position', "Position required").not().isEmpty(),
		check('position', "Invalid position").isIn(["RS", "RF", "BS", "BF"])
	],
	function (req, res, next) {
		console.log(req.body.userID);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const matchID = req.params.matchid;
		const userID = req.body.userID;
		const position = req.body.position;
		//Put the player in the match at the given position.
		try {
			const payload = MatchManager.leaveMatch(matchID, userID, position);
			res.json(payload);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	});

router.post("/:matchid/joinmatch",
	[
		check('userID', 'User ID is required').not().isEmpty(),
		check('name', 'name is required').not().isEmpty(),
		check('position', "Position required").not().isEmpty(),
		check('position', "Invalid position").isIn(["RS", "RF", "BS", "BF"])
	],
	function (req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		console.log("In join match");
		const { userID, position, name } = req.body;
		const matchID = req.params.matchid;
		//Put the player in the match at the given position.
		try {
			const payload = MatchManager.joinMatch(matchID, userID, position, name);
			console.log("End join match");
			res.json(payload);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	});

router.post("/:matchid/nextmove",
	[
		check('userID', 'User ID is required').not().isEmpty(),
		check('position', "Position required").not().isEmpty(),
		check('position', "Invalid position").isIn(["RS", "RF", "BS", "BF", "_PING", "_CHAT"]),
		check("move", "Move is required").not().isEmpty()
	],
	function (req, res, next) {
		console.log("hello");
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { userID, position, move, name, role, turnId } = req.body;
		const matchID = req.params.matchid;
		try {
			let gameState = {};
			//Check who is sending the move (spy master or field agent) and call appropriate method.
			if (position == "RF" || position == "BF") {
				if (move == "_END") {
					console.log("calling end turn in match manager");
					gameState = MatchManager.endTurn(matchID, userID, turnId);
				} else gameState = MatchManager.fieldGuess(matchID, userID, move, turnId);
			} else if (position == "BS" || position == "RS") {
				let num = move.substr(0, move.indexOf(' '));
				let word = move.substr(move.indexOf(' ') + 1);
				console.log("calling spycommand in match manager");
				gameState = MatchManager.spyCommand(matchID, userID, num, word, turnId, name);
			} else if (position === "_CHAT") {
				gameState = MatchManager.spyCommand(matchID, userID, 1, move, turnId, name, role)
			} else {
				gameState = MatchManager.getMatchInfo(matchID)
			}
			console.log("bye");

			//add properties to gameState
			let match = MatchManager.getGame(matchID);
			gameState.blueScore = 8 - match.blueLeft;
			gameState.redScore = 9 - match.redLeft;
			gameState.isOver = match.isGameOver();
			gameState.winner = match.getWinner();
			gameState.turnId = match.turnId;

			console.log(gameState);
			res.json(gameState);
		} catch (err) {
			console.error(err.message);
			console.error(err.stack);
			res.status(500).send('Server error');
		}
	});

router.get('/joinrandom',
	function (req, res, next) {
		try {
			const randomGame = MatchManager.randomPublicMatch()
			console.log('\n\nrandomGame ', randomGame)
			res.json(randomGame)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Server error');
		}
	})
module.exports = router;
