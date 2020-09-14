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
  opponentsHits: { type: Number, default: 0 },
  civiliansHits: { type: Number, default: 0 },
  assassinsHits: { type: Number, default: 0 },
  correctHits: { type: Number, default: 0 },
  opponentsAssists: { type: Number, default: 0 },
  civiliansAssists: { type: Number, default: 0 },
  assassinsAssists: { type: Number, default: 0 },
  correctAssists: { type: Number, default: 0 },
  numHints: { type: Number, default: 0 },
  numWins: { type: Number, default: 0 },
  numLosses: { type: Number, default: 0 }
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
  const user = await User.findById(userId);
  console.log(user);
  const ids = user.matchIds;
  const matchDescs = Match.find({"_id" : { $in: ids}}).sort({date: -1}).limit(4).populate("participants.user");
  return matchDescs;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
