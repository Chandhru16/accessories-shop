// GET /api/settings/upi (public) — used by the checkout page to render the
// UPI QR code. The UPI ID itself lives in an env var, not the database, so
// changing it is as simple as editing server/.env and restarting.
exports.getUpiInfo = (req, res) => {
  res.json({
    upiId: process.env.SHOP_UPI_ID || "",
    payeeName: process.env.SHOP_UPI_NAME || "Golden Plaza",
  });
};
