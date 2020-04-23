const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Match = require("../models/match");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  matchIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Match" }
  ],
});

// Hash the password before saving the user model
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Search for a user by email and password
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return null;
  }
  return user;
};

// Generate a token for the user
userSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_KEY,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  return token;
};

// delete password
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.statics.getMatches = async function (userId) {
  const user = await User.findById(userId).populate("Match");
  return user.matchIds;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
