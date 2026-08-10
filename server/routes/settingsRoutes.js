const express = require("express");
const router = express.Router();
const { getUpiInfo } = require("../controllers/settingsController");

router.get("/upi", getUpiInfo);

module.exports = router;
