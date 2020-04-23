const express = require("express");
const router = express.Router();
const User = require('../models/user');

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const matches = await User.getMatches(userId);
  res.send(matches);
});

module.exports = router;
