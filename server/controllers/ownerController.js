const bcrypt = require("bcryptjs");
const Owner = require("../models/Owner");
const generateToken = require("../utils/generateToken");

// POST /api/owner/login
exports.loginOwner = async (req, res) => {
  try {
    const { username, password } = req.body;
    const owner = await Owner.findOne({ username });
    if (!owner) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = generateToken({ id: owner._id, role: "owner" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};
