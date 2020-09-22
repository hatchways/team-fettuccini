const express = require("express");
const User = require('../models/user');
const Match = require('../models/match');
const auth = require("../middleware/auth");
const NodeCache = require('node-cache');
const router = express.Router();
const requestCache = new NodeCache({stdTTL: 0, checkperiod: 5 });
const users = new Map();
const sortBy = new Map();


async function requestAndCache() {
	const setData = function (err, allUsers) {
		requestCache.set("allUsers", allUsers);

		console.log("Creating user map");
		sortBy.clear();
		users.clear();
		allUsers.forEach((element) => {
			users.set(String(element._id), element);
		});
		console.log("Created user map");
	}
	
	const error = function (err) {
		console.log("Error getting users from database", err);
	}
	console.log("Fetching new data");
	User.find({}, (err, allUsers) => setData(err, allUsers)).catch((err)=>(console.log(err))).catch((err)=>(console.log(err)));
	console.log("Processing db data");
}

requestAndCache();
setInterval(function () { requestAndCache() }, 30000);

function sendBack(res, data) {
	res.setHeader("Cache-Control", "no-store");
	console.log("Sending back");
	return res.status(200).send(data);
}

function sendBackNoData(res) {
	return res.status(204).send({ message: "No data to fetch" })
}

router.get("/byuser", async (req, res) => {
	const name = req.query.username;
	console.log(name);
	
	try {
		if (requestCache.getStats().keys == 0) {
			console.log("Refreshing cache");
			//requestAndCache();
			return sendBackNoData(res);
		} else {
			if (!users.has(String(name))) {
				console.log("Getting user info from database");
				const userObj = await User.find({ username: name });
				console.log(userObj)
				sendBack(res, { data: userObj });
			} else {
				console.log("Getting user info from cache map");
				const user = users.get(userId);
				console.log("User")
				res.setHeader("Cache-Control", "no-store");
				sendBack(res, { data: user });
			}
		}
	} catch (error) {
		
	}
})

const statFuncs = {
	numWins: function (obj) { return obj.numWins; },
	numLosses: function(obj) { return obj.numLosses; },
	opponentsHits: function(obj) { return obj.opponentsHits; },
	correctHits: function(obj) { return obj.correctHits; },
	assassinsHits: function(obj) { return obj.assassinsHits; },
	civiliansHits: function(obj) { return obj.civiliansHits; },
	opponentsAssists: function(obj) { return obj.opponentsAssists; },
	correctAssists: function(obj) { return obj.correctAssists; },
	assassinsAssists: function(obj) { return obj.assassinsAssists; },
	civiliansAssists: function(obj) { return obj.civiliansAssists; },
	numHints: function(obj) { return obj.numHints; },
	correctGuessPercent: function(obj) { return Number.parseFloat(obj.correctHits/(obj.correctHits+obj.assassinsHits+obj.civiliansHits+obj.opponentsHits)).toFixed(2); },
	correctAssistsPercent: function(obj) { return Number.parseFloat(obj.correctAssists/(obj.correctAssists+obj.assassinsAssists+obj.civiliansAssists+obj.opponentsAssists)).toFixed(2); },
	correctGuessesPerHint: function(obj) { return Number.parseFloat(obj.correctAssists/(obj.numHints)).toFixed(2); },
	winPercent: function(obj) { return Number.parseFloat((obj.numWins)/(obj.numWins+obj.numLosses)).toFixed(2); }
}

router.get("/standings", async (req, res) => {
	try {
		//If cache needs to be refreshed retrieve the list of users.
		if (requestCache.getStats().keys == 0) {
			console.log("Refreshing cache");
			//requestAndCache();
			return sendBackNoData(res);
		}
		
		let pageSkip = req.query.page-1;
		let sorting = req.query.sortBy;
		let order = req.query.order;
		console.log("fetching standings");
		if (statFuncs[sorting]==undefined) return res.status(400).send({ message: "Sorting criteria not identified"});
		const sortFunc = function (x, y) {
			const statFunc = statFuncs[sorting];
			return statFunc(y)-statFunc(x);
		}
		//Cache function caches the results of the standings if it has not been cached with that ordering already.
		if (!sortBy.has(sorting)) {
			console.log("Cache doesn't have it");
			const allUsers = requestCache.get("allUsers");
			const sortedUsers = [...allUsers];
			console.log("Retrieved cache");
			sortedUsers.sort(sortFunc);
			sortBy.set(sorting, sortedUsers);
		}
		
		if (order == "asc" && !sortBy.has(sorting+"Reverse")) {
			const inOrder = sortBy.get(sorting);
			const reverseOrder = [];
			for (let i = inOrder.length-1;i>=0;i--) reverseOrder.push(inOrder[i]);
			sortBy.set(sorting+"Reverse", reverseOrder);
		}
		
		console.log("Returning value");
		let values;
		if (order == "asc") {
			values = sortBy.get(sorting+"Reverse");
		} else {
			values = sortBy.get(sorting);
		}
		
		let index = pageSkip * 50;
		let lastIndex = index + 50;
		if (index>=values.length) return res.status(200).send({ message: "None" });
		if (lastIndex >= values.length) lastIndex = values.length;
		let page = values.slice(index, lastIndex);
		
		return sendBack(res, { start: index+1, data: page });
				
	} catch (error) {
		console.log("Error:");
		console.log(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
})

module.exports = router;