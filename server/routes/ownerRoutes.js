const express = require("express");
const router = express.Router();
const { requireOwner } = require("../middleware/authMiddleware");
const { loginOwner } = require("../controllers/ownerController");
const {
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { addProduct, deleteProduct } = require("../controllers/productController");

router.post("/login", loginOwner);

router.get("/orders", requireOwner, getOrders);
router.patch("/orders/:id/status", requireOwner, updateOrderStatus);

router.post("/products", requireOwner, addProduct);
router.delete("/products/:id", requireOwner, deleteProduct);

module.exports = router;
