const mongoose = require("mongoose");

const matchSchema = mongoose.Schema({
  date: Date,
  blueScore: Number,
  redScore: Number,
  winner: String,
  participants: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: String }],
  history: [String],
  words: [String],
  factions: [String],
  RFGuessesCorrect: Number,
  RFAssassinHit: Number,
  RFCivilianHit: Number,
  RFOpponentHit: Number,
  BFGuessesCorrect: Number,
  BFAssassinHit: Number,
  BFCivilianHit: Number,
  BFOpponentHit: Number,
  RSHintsGiven: Number,
  BSHintsGiven: Number
});

matchSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj._id;
  return obj;
};

const Match = mongoose.model("Match", matchSchema);
module.exports = Match;
