const Customer = require("../models/Customer");
const generateToken = require("../utils/generateToken");

// POST /api/auth/login
// Creates the customer on first visit, or updates their details on repeat
// visits (in case they change address/pincode/email), then logs them in
// directly — no OTP step.
exports.loginCustomer = async (req, res) => {
  try {
    const { userName, mobileNumber, email, addressDetails, pincode } = req.body;

    if (!userName || !mobileNumber || !email || !addressDetails || !pincode) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let customer = await Customer.findOne({ mobileNumber });
    if (customer) {
      customer.userName = userName;
      customer.email = email;
      customer.addressDetails = addressDetails;
      customer.pincode = pincode;
      await customer.save();
    } else {
      customer = await Customer.create({
        userName,
        mobileNumber,
        email,
        addressDetails,
        pincode,
      });
    }

    const token = generateToken({ id: customer._id, role: "customer" });

    res.json({
      token,
      customer: {
        _id: customer._id,
        userName: customer.userName,
        mobileNumber: customer.mobileNumber,
        email: customer.email,
        addressDetails: customer.addressDetails,
        pincode: customer.pincode,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};
