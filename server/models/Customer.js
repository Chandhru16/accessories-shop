const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    addressDetails: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
