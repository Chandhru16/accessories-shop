const mongoose = require("mongoose");

const orderProductSchema = new mongoose.Schema(
  {
    productId: { type: String }, // accepts both real Mongo IDs and temporary mock IDs (p1, p2, etc.)
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
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Placed", "NoStock", "NotAbleToDeliver", "Delivered"],
      default: "Placed",
    },
    trackingId: { type: String, default: null },
    courierCompany: { type: String, default: null },
    expectedDeliveryDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
