// Standalone email test — bypasses the whole app so you can isolate
// whether Gmail/Nodemailer itself is the problem, separate from any
// order-placement logic.
//
// Usage: cd server && node test-email.js
require("dotenv").config();
const nodemailer = require("nodemailer");

const { EMAIL_USER, EMAIL_APP_PASSWORD } = process.env;

if (!EMAIL_USER || !EMAIL_APP_PASSWORD) {
  console.log("❌ EMAIL_USER or EMAIL_APP_PASSWORD is missing from server/.env");
  process.exit(1);
}

console.log(`Attempting to send a test email from ${EMAIL_USER} to itself...`);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_APP_PASSWORD },
});

transporter.sendMail(
  {
    from: `"Golden Plaza Test" <${EMAIL_USER}>`,
    to: EMAIL_USER,
    subject: "Test email from Golden Plaza server",
    text: "If you're reading this, EMAIL_USER and EMAIL_APP_PASSWORD are working correctly.",
  },
  (err, info) => {
    if (err) {
      console.log("❌ FAILED — here's the exact error from Gmail:");
      console.log(err);
      process.exit(1);
    } else {
      console.log("✅ SUCCESS — check the inbox for", EMAIL_USER);
      console.log(info);
      process.exit(0);
    }
  }
);
