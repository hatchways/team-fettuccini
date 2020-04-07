const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req, res, next) => {
    const token = req.cookies['token'] || '';
    try {
      if (!token) {
        return res.status(401).json('You need to Login')
      }

      const decrypt = await jwt.verify(token, process.env.JWT_KEY);

      req.user = {
        id: decrypt.id,
        username: decrypt.username,
        email:decrypt.email
      };
     
      next();
    } catch (err) {
      return res.status(500).json(err.toString());
    }
}

module.exports = auth;