const express = require("express");
const User = require('../models/user');
const Match = require('../models/match');
const auth = require("../middleware/auth");
const NodeCache = require('node-cache');
const router = express.Router();
const requestCache = new NodeCache({stdTTL: 30, checkperiod: 5 });
const users = new Map();
const sortBy = new Map();

async function requestAndCache() {
	
	console.log("Fetching new data");
	await User.find({}, function (err, allUsers) {
		requestCache.set("allUsers", allUsers);

		console.log("Creating user map");
		sortBy.clear();
		users.clear();
		allUsers.forEach((element) => {
			users.set(String(element._id), element);
		});
		console.log("Created user map");
	}).catch((err)=>{console.log("Error getting users from database", err)});
	
	console.log("Processing db data");
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
		let sorting = req.query.sortBy;
		console.log("fetching standings");
		const cacheFunction = (sortFunc, sortByVal) => {
			console.log("In caching function")
			if (!sortBy.has(sortByVal)) {
				const allUsers = requestCache.get("allUsers");
				const sortedUsers = [...allUsers];
				sortedUsers.sort(sortFunc);
				sortBy.set(sortByVal, sortedUsers);
			}
			console.log("Returning value");
			return res.status(200).send(sortBy.get(sortByVal));
		}
		
		if (sorting=="numWins") {
			const sortFunction = function(x, y) {
					const val1 = x.numWins;
					const val2 = y.numWins;
					return val2 - val1;
				};
			return cacheFunction(sortFunction, "numWins");
		} else if (sorting=="numLosses") {
			const sortFunction = function(x, y) {
					const val1 = x.numLosses;
					const val2 = y.numLosses;
					return val2 - val1;
				};
			return cacheFunction(sortFunction, "numLosses");
		} else if (sorting == "opponentsHits") {
			const sortFunction = function(x, y) {
					const val1 = x.opponentsHits;
					const val2 = y.opponentsHits;
					return val2 - val1;
				};
			return cacheFunction(sortFunction, "opponentsHits");
		} else if (sorting == "correctHits") {
			const sortFunction = function(x, y) {
					const val1 = x.correctHits;
					const val2 = y.correctHits;
					return val2 - val1;
				};
			return cacheFunction(sortFunction, "correctHits");
		} else if (sorting == "assassinsHits") {
			const sortFunction = function(x, y) {
					const val1 = x.assassinsHits;
					const val2 = y.assassinsHits;
					return val2 - val1;
				};
			return cacheFunction(sortFunction, "assassinsHits");
		} else if (sorting == "civiliansHits") {
			const sortFunction = function(x, y) {
					const val1 = x.civiliansHits;
					const val2 = y.civiliansHits;
					return val2 - val1;
				};
			return cacheFunction(sortFunction, "civiliansHits");
		} else if (sorting == "opponentsAssists") {
			const sortFunction = function(x, y) {
					const val1 = x.opponentsAssists;
					const val2 = y.opponentsAssists;
					return val2 - val1;
				};
			return cacheFunction(sortFunction, "opponentsAssists");
		} else if (sorting == "civiliansAssists") {
			const sortFunction = function(x, y) {
					const val1 = x.civiliansAssists;
					const val2 = y.civiliansAssists;
					return val2 - val1;
				}
			return cacheFunction(sortFunction, "civiliansAssists");
		} else if (sorting == "correctAssists") {
			const sortFunction =function(x, y) {
					const val1 = x.correctAssists;
					const val2 = y.correctAssists;
					return val2 - val1;
				}
			return cacheFunction(sortFunction, "correctAssists");
		} else if (sorting == "assassinsAssists") {
			const sortFunction = function(x, y) {
					const val1 = x.assassinsAssists;
					const val2 = y.assassinsAssists;
					return val2 - val1;
				}
			return cacheFunction(sortFunction, "assassinsAssists");
		} else if (sorting == "numHints") {
			const sortFunction = function(x, y) {
					const val1 = x.numHints;
					const val2 = y.numHints;
					return val2 - val1;
				}
			return cacheFunction(sortFunction, "numHints");
		} else if (sorting == "correctGuessPercent") {
			const sortFunction = function(x, y) {
					const val1 = Number.parseFloat(x.correctHits/(x.correctHits+x.assassinsHits+x.civiliansHits+x.opponentsHits)).toFixed(2);
					const val2 = Number.parseFloat(y.correctHits/(y.correctHits+y.assassinsHits+y.civiliansHits+y.opponentsHits)).toFixed(2);
					return val2 - val1;
				}
			return cacheFunction(sortFunction, "correctGuessPercent");
		} else if (sorting == "correctAssistsPercent") {
			const sortFunction = function(x, y) {
					const val1 = Number.parseFloat(x.correctAssists/(x.correctAssists+x.assassinsAssists+x.civiliansAssists+x.opponentsAssists)).toFixed(2);
					const val2 = Number.parseFloat(y.correctAssists/(y.correctAssists+y.assassinsAssists+y.civiliansAssists+y.opponentsAssists)).toFixed(2);
					return val2 - val1;
				}
			return cacheFunction(sortFunction, "correctAssistsPercent");
		} else if (sorting == "correctGuessesPerHint") {
			const sortFunction = function(x, y) {
				const val1 = Number.parseFloat(x.correctAssists/(x.numHints)).toFixed(2);
				const val2 = Number.parseFloat(y.correctAssists/(y.numHints)).toFixed(2);
				return val2 - val1;
			}
			return cacheFunction(sortFunction, "correctGuessesPerHint");
		} else if (sorting == "winPercent") {
			const sortFunction = function(x, y) {
				const val1 = Number.parseFloat((x.numWins)/(x.numWins+x.numLosses)).toFixed(2);
				const val2 = Number.parseFloat((y.numWins)/(y.numWins+y.numLosses)).toFixed(2);
				return val2 - val1;
			}
			return cacheFunction(sortFunction, "winPercent");
		}
		
		return res.status(200).send();
		
	} catch (error) {
		
	}
})

module.exports = router;