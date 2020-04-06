const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const MatchManager = require('../admin/MatchManagement.js');

router.post("/", 
[
	check('userID', 'User ID is required').not().isEmpty(),
	check("matchID", "Match ID is required").not().isEmpty(),
	check('position', "Position required").not().isEmpty(),
	check('position', "Invalid position").isIn(["RS", "RF", "BS", "BF"]),
	check("move", "Move is required").not().isEmpty()
],
function(req, res, next) {
	console.log("hello");
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array()});
	}

	const {userID, matchID, position, move} = req.body;

	try {
		let gameState = {};
		//Check who is sending the move (spy master or field agent) and call appropriate method.
		if (position == "RF" || position == "BF") {
			if (move=="_END") {
				console.log("calling end turn in match manager");
				gameState = MatchManager.endTurn(matchID, userID); 
			}
			else gameState = MatchManager.fieldGuess(matchID, userID, move);
		}
		else if (position == "BS" || position == "RS") {
			let num = move.substr(0, move.indexOf(' '));
			let word = move.substr(move.indexOf(' ')+1);
			console.log("calling spycommand in match manager");
			gameState = MatchManager.spyCommand(matchID, userID, num, word);
		} else {
			//TODO return game state for spectator.
		}
		console.log("bye");
		console.log(gameState);
		res.json(gameState);
	} catch (err) {
		console.error(err.message);
		console.error(err.stack);
		res.status(500).send('Server error');
	}
});

module.exports = router;