const express = require("express");
const router = express.Router();
const { loginCustomer } = require("../controllers/authController");

router.post("/login", loginCustomer);

module.exports = router;
