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
	check('position', "Invalid position").isIn(["RS", "RF", "BS", "BF"])
],
function(req, res, next) {
	console.log("hello");
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array()});
	}

	const {userID, matchID, position} = req.body;
	//Put the player in the match at the given position.
	try {
		const payload = MatchManager.joinMatch(matchID, userID, position);
		console.log("here");
		res.json(payload);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;