const express = require("express");
const User = require('../models/user');
const Match = require('../models/match');
const auth = require("../middleware/auth");
const NodeCache = require('node-cache');
const router = express.Router();
const requestCache = new NodeCache({stdTTL: 30, checkperiod: 5 });
const users = new Map();

async function requestAndCache() {
	
	console.log("Fetching new data");
	await User.find({}, function (err, allUsers) {
		console.log(allUsers[0]);
		let wins = [];
		let losses = [];
		let opponentsHits = [];
		let correctHits = [];
		let civiliansHits = [];
		let assassinsHits = [];
		let opponentsAssists = [];
		let correctAssists = [];
		let civiliansAssists = [];
		let assassinsAssists = [];
		let numHints = [];
		let correctGuessPercent = [];
		let correctAssistsPercent = [];
		let correctGuessesPerHint = [];
		let resultsCached = 0;
		
		console.log("Started creating promises");

		new Promise(() => {
			console.log("Creating user map");
			users.clear();
			allUsers.forEach((element) => {
				users.set(String(element._id), element);
			});
			console.log("Created user map");
			resultsCached++;
			console.log(resultsCached);
		});
		
		wins = [...allUsers];
		wins.sort(function(x, y) { 
			console.log("hello ", x);
			console.log("numWins ", x.numWins);
			const val1 = x.numWins;
			const val2 = y.numWins;
			return val2 - val1;
		});

		losses = [...allUsers];
		losses.sort(function(x, y) {
			const val1 = x.numLosses;
			const val2 = y.numLosses;
			return val1 - val2;
		});

		opponentsHits = [...allUsers];
		opponentsHits.sort(function(x, y) {
			const val1 = x.opponentsHits;
			const val2 = y.opponentsHits;
			return val1 - val2;
		});

		
		correctHits = [...allUsers];
		correctHits.sort(function(x, y) {
			const val1 = x.correctHits;
			const val2 = y.correctHits;
			return val1 - val2;
		});

		
		civiliansHits = [...allUsers];
		civiliansHits.sort(function(x, y) {
			const val1 = x.civiliansHits;
			const val2 = y.civiliansHits;
			return val1 - val2;
		});

		
		assassinsHits = [...allUsers];
		assassinsHits.sort(function(x, y) {
			const val1 = x.assassinsHits;
			const val2 = y.assassinsHits;
			return val1 - val2;
		});

		
		opponentsAssists = [...allUsers];
		opponentsAssists.sort(function(x, y) {
			const val1 = x.opponentsAssists;
			const val2 = y.opponentsAssists;
			return val1 - val2;
		});

		
		correctAssists = [...allUsers];
		correctAssists.sort(function(x, y) {
			const val1 = x.correctAssists;
			const val2 = y.correctAssists;
			return val1 - val2;
		});
		
		civilianAssists = [...allUsers];
		civiliansAssists.sort(function(x, y) {
			const val1 = x.civiliansAssists;
			const val2 = y.civiliansAssists;
			return val1 - val2;
		});

		
		assassinsAssists = [...allUsers];
		assassinsAssists.sort(function(x, y) {
			const val1 = x.assassinsAssists;
			const val2 = y.assassinsAssists;
			return val1 - val2;
		});
		
		numHints = [...allUsers];
		numHints.sort(function(x, y) {
			const val1 = x.numHints;
			const val2 = y.numHints;
			return val1 - val2;
		});
		
		correctGuessPercent = [...allUsers];
		correctGuessPercent.sort(function(x, y) {
			const val1 = Number.parseFloat(x.correctHits/(x.correctHits+x.assassinsHits+x.civiliansHits+x.opponentsHits)).toFixed(2);
			const val2 = Number.parseFloat(y.correctHits/(y.correctHits+y.assassinsHits+y.civiliansHits+y.opponentsHits)).toFixed(2);
			return val1 - val2;
		});
		
		correctAssistsPercent = [...allUsers]
		correctAssistsPercent.sort(function(x, y) {
			const val1 = Number.parseFloat(x.correctAssists/(x.correctAssists+x.assassinsAssists+x.civiliansAssists+x.opponentsAssists)).toFixed(2);
			const val2 = Number.parseFloat(y.correctAssists/(y.correctAssists+y.assassinsAssists+y.civiliansAssists+y.opponentsAssists)).toFixed(2);
			return val1 - val2;
		});
		
		correctGuessesPerHint = [...allUsers];
		correctGuessesPerHint.sort(function(x, y) {
			const val1 = Number.parseFloat(x.correctAssists/(x.numHints)).toFixed(2);
			const val2 = Number.parseFloat(y.correctAssists/(y.numHints)).toFixed(2);
			return val1 - val2;
		});
		
		requestCache.set("numWins", wins);
		requestCache.set("numLosses", losses);
		requestCache.set("opponentsHits", opponentsHits);
		requestCache.set("correctHits", correctHits);
		requestCache.set("civiliansHits", civiliansHits);
		requestCache.set("assassinsHits", assassinsHits);
		requestCache.set("opponentsAssists", opponentsAssists);
		requestCache.set("correctAssists", correctAssists);
		requestCache.set("civiliansAssists", civiliansAssists);
		requestCache.set("assassinsAssists", assassinsAssists);
		requestCache.set("numHints", numHints);
		requestCache.set("correctGuessPercent", correctGuessPercent);
		requestCache.set("correctAssistsPercent", correctAssistsPercent);
		requestCache.set("correctGuessesPerHint", correctGuessesPerHint);
	}).catch((err)=>{console.log("Error getting users from database", err)});
	
	
}

router.get("/byuser", async (req, res) => {
	const userId = req.query.userId;
	console.log(userId);
	//const matches = await User.getMatches(userId);
	
	try {
		if (requestCache.getStats().keys == 0) {
			console.log("Refreshing cache");
			await requestAndCache();
		}
		if (!users.has(String(userId))) {
			const userObj = await User.findById(userId);
			console.log("Getting user info from database");
			return res.status(200).send(userObj);
		} else {
			console.log("Getting user info from cache map");
			return res.status(200).send(users.get(userId));
		}		
	} catch (error) {
		
	}
})

router.get("/standings", async (req, res) => {
	try {
		if (requestCache.getStats().keys == 0) {
			console.log("Refreshing cache");
			await requestAndCache();
		}
		
		let pageSkip = req.query.page-1;
		let sortBy = req.query.sortBy;
		return res.status(200).send(requestCache.get(sortBy));
		
	} catch (error) {
		
	}
})

module.exports = router;