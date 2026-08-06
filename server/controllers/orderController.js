const Order = require("../models/Order");

// POST /api/orders (customer only)
exports.createOrder = async (req, res) => {
  try {
    const { products, addressDetails, pincode, totalAmount } = req.body;
    const order = await Order.create({
      customerId: req.user.id,
      products,
      addressDetails,
      pincode,
      totalAmount,
    });
    res.status(201).json({ message: "Order placed.", orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: "Failed to place order.", error: err.message });
  }
};

// GET /api/orders/my (customer only) — used by the notification bell
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your orders.", error: err.message });
  }
};

// GET /api/orders/status/:id — used to refresh a single locally-stored
// notification's status. No auth required (see notifications.js on the
// client for why this needs to work across saved-address identities).
exports.getOrderStatusById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).select(
      "products status trackingId courierCompany expectedDeliveryDate createdAt"
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order status.", error: err.message });
  }
};

// GET /api/owner/orders (owner only)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "userName mobileNumber addressDetails")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders.", error: err.message });
  }
};

// PATCH /api/owner/orders/:id/status (owner only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingId, courierCompany, expectedDeliveryDate } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    order.status = status;
    if (status === "Delivered") {
      order.trackingId = trackingId || null;
      order.courierCompany = courierCompany || null;
      order.expectedDeliveryDate = expectedDeliveryDate || null;
    }
    await order.save();

    res.json({ message: "Order status updated.", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order.", error: err.message });
  }
};

// DELETE /api/owner/orders/:id (owner only) — permanently removes an order
// record from the database.
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Order deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order.", error: err.message });
  }
};
