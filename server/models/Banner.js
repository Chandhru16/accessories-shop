const mongoose = require("mongoose");

// Promotional banners shown in the full-width carousel on the customer
// home page. Capped at 20 (enforced in the controller) to keep the
// carousel manageable.
const bannerSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, default: null }, // optional — where clicking the banner goes
    order: { type: Number, default: 0 }, // lower shows first
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
