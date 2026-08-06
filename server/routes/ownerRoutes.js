const express = require("express");
const router = express.Router();
const { requireOwner } = require("../middleware/authMiddleware");
const { loginOwner } = require("../controllers/ownerController");
const {
  getOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const {
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  addBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");

router.post("/login", loginOwner);

router.get("/orders", requireOwner, getOrders);
router.patch("/orders/:id/status", requireOwner, updateOrderStatus);
router.delete("/orders/:id", requireOwner, deleteOrder);

router.post("/products", requireOwner, addProduct);
router.put("/products/:id", requireOwner, updateProduct);
router.delete("/products/:id", requireOwner, deleteProduct);

router.post("/banners", requireOwner, addBanner);
router.put("/banners/:id", requireOwner, updateBanner);
router.delete("/banners/:id", requireOwner, deleteBanner);

module.exports = router;
