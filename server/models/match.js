const mongoose = require("mongoose");

const matchSchema = mongoose.Schema({
  date: Date,
  blueScore: Number,
  redScore: Number,
  winner: String,
  participants: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: String }],
  history: [String]
});

matchSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj._id;
  return obj;
};

const Match = mongoose.model("Match", matchSchema);
module.exports = Match;
