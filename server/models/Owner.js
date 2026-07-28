const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // stored hashed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Owner", ownerSchema);
