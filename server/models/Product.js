const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    stock: { type: Number, default: 0 },
    imgUrls: {
      type: [String],
      validate: (arr) => arr.length > 0 && arr.length <= 3,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
