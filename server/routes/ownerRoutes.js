const express = require("express");
const router = express.Router();
const { requireOwner } = require("../middleware/authMiddleware");
const { loginOwner } = require("../controllers/ownerController");
const {
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const {
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.post("/login", loginOwner);

router.get("/orders", requireOwner, getOrders);
router.patch("/orders/:id/status", requireOwner, updateOrderStatus);

router.post("/products", requireOwner, addProduct);
router.put("/products/:id", requireOwner, updateProduct);
router.delete("/products/:id", requireOwner, deleteProduct);

module.exports = router;
