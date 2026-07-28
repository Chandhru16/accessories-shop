const express = require("express");
const router = express.Router();
const { requireCustomer } = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderStatusById,
} = require("../controllers/orderController");

router.post("/", requireCustomer, createOrder);
router.get("/my", requireCustomer, getMyOrders);
router.get("/status/:id", getOrderStatusById); // no auth — status refresh only

module.exports = router;
