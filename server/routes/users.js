const express = require("express");
const User = require('../models/user');
const auth = require("../middleware/auth");
const router = express.Router();


// Create a new user
router.post("/", async (req, res) => {
    try {
        console.log(req.body)
        const user = new User(req.body);
        await user.save();

        const token = await user.generateAuthToken();

        res.cookie('token', token, {
            expires: new Date(Date.now() + 60 * 60 * 24 * 30),  // 30 days
            secure: false,
            httpOnly: true,
        });
        console.log('user', user)
        res.status(201).send({ user });
    } catch (error) {
        res.status(400).send(error);
    }
})


//Login a registered user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password)

        if (user == null) {
            return res.status(403).send({ error: 'Login failed! Check your credentials' });
        }

        const token = await user.generateAuthToken();

        res.cookie('token', token, {
            expires: new Date(Date.now() + 60 * 60 * 24 * 30),  // 30 days
            secure: false,
            httpOnly: true,
        });

        res.status(200).send({ user });

    } catch (error) {
        res.status(400).send(error)
    }

})


router.get("/newgame", auth, async (req, res) => {
    res.send(req.user);
})


router.get("/profile", auth, async (req, res) => {
	try {
		const userID = req.user.id;
		if (userID == null || userID == undefined) {
			return res.send({error: "Invalid userID"});
		}
		let matches = await User.getMatches(userID);
		
		if (matches==null) {
			return res.send({error: "User doesn't exist"});
		}
		console.log(matches[0]);
		res.status(200).send({matchList: matches});
	} catch (error) {
		res.status(400).send(error);
	}
	
})

module.exports = router;
