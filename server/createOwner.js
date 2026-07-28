// One-time script to create the owner account.
// Usage: node createOwner.js <username> <password>
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Owner = require("./models/Owner");

const [, , username, password] = process.argv;

if (!username || !password) {
  console.log("Usage: node createOwner.js ahsan 27012006");
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await Owner.findOne({ username });
  if (existing) {
    console.log("An owner with that username already exists.");
    process.exit(0);
  }
  const hashed = await bcrypt.hash(password, 10);
  await Owner.create({ username, password: hashed });
  console.log(`Owner account "${username}" created successfully.`);
  process.exit(0);
})();
