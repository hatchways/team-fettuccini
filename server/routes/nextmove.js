const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const MatchManager = require('../admin/MatchManagement.js');

router.get("/", 
[
	check('userID', 'User ID is required').not().isEmpty(),
	check("matchID", "Match ID is required").not().isEmpty(),
	check('position', "Position required").not().isEmpty(),
	check('position', "Invalid position").isIn(["RS, RF, BS, BF"]),
	check("move", "Move is required").not.isEmpty()
],
function(req, res, next) {
	console.log("hello");
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array()});
	}

	const {userID, matchID, position, move} = req.body;

	try {
		let gameID = MatchManager.joinMatch(userID, matchID, position);
		let gameState = {};
		if (position == "RF" || position == "BF") {
			gameState = MatchManager.fieldGuess(move);
		}
		else if (position == "BS" || position == "RS") {
			gameState = MatchManager.spyCommand(move);
		} else {
			//TODO return game state for spectator.
		}

		const payload = {
			matchState : gameState
		}

		res.json(payload);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;