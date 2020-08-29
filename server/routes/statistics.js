const express = require("express");
const User = require('../models/user');
const Match = require('../models/match');
const auth = require("../middleware/auth");
const NodeCache = require('node-cache');
const router = express.Router();
const requestCache = new NodeCache({stdTTL: 30, checkperiod: 5 });

router.get("/byuser", async (req, res) => {
	const userId = req.query.userId;
	//const matches = await User.getMatches(userId);
	
	try {
		let userObj = await User.findById(userId);		
		console.log(userObj);
		
		
		return res.status(200).send(userObj);
	} catch (error) {
		
	}
})

router.get("/standings", async (req, res) => {
	try {
		let pageSkip = req.query.page-1;
		let sortBy = req.query.sortBy;
		if (sortBy=="wins") {
			let result = request.get("wins");
			if (!result) {
				result = await User.find({}).sort({numWins: 1});
				requestCache.set("wins", result);
			}
			console.log(result);
		}
		//await User.find({}).sort({numWins: 1}).skip(50*pageSkip).limit(50);
		
	} catch (error) {
		
	}
})

module.exports = router;