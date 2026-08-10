const mongoose = require("mongoose");

const orderProductSchema = new mongoose.Schema(
  {
    productId: { type: String }, // accepts both real Mongo IDs and mock IDs (p1, p2, etc.)
    name: String,
    price: Number,
    qty: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    products: [orderProductSchema],
    addressDetails: { type: String, required: true },
    pincode: { type: String },
    email: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Placed", "NoStock", "NotAbleToDeliver", "Delivered"],
      default: "Placed",
    },
    trackingId: { type: String, default: null },
    courierCompany: { type: String, default: null },
    expectedDeliveryDate: { type: Date, default: null },

    // ---- Payment (manual UPI verification) ----
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI"],
      default: "COD",
    },
    upiTransactionRef: { type: String, default: null }, // UTR / reference number the customer enters
    paymentStatus: {
      type: String,
      enum: ["NotApplicable", "Pending", "Verified"],
      default: "NotApplicable",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
