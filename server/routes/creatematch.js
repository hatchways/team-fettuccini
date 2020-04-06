const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const MatchManager = require('../admin/MatchManagement.js');

router.post("/", 
[
	check('hostID', "No host id provided").not().isEmpty()
], 
function(req, res, next) {
	console.log("hello");
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array()});
	}

	const {hostID} = req.body;

	try {
		let gameID = MatchManager.createMatch(hostID);

		res.json(gameID);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;