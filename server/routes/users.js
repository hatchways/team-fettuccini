const express = require("express");
const User = require('../models/user');
const auth = require("../middleware/auth");
const router = express.Router();


// Create a new user
router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
      
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
})


//Login a registered user
router.post("/users/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password)

        if (user == null) {
            return res.status(403).send({error: 'Login failed! Check your credentials'});
        }

        const token = await user.generateAuthToken();
        
        res.cookie('token', token, {
            expires: new Date(Date.now() + 60*60*24*30),  // 30 days
            secure: false,
            httpOnly: true,
        });
        
        res.send({ user });

  } catch (error) {
      res.status(400).send(error)
  }

})


router.get("/users/test", auth, async(req, res) => {
    res.send(req.user);
})


module.exports = router;
