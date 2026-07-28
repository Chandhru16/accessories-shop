const mongoose = require("mongoose");

// Short-lived OTP requests, kept separate from the Customer collection so an
// unverified visitor never creates a permanent customer record.
const otpSchema = new mongoose.Schema(
  {
    mobileNumber: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Auto-delete expired OTP docs.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", otpSchema);
