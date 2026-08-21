// Sends order confirmation emails via Gmail SMTP using Nodemailer — this is
// free for reasonable order volumes (Gmail's own sending limits apply,
// generally fine for a small shop). If EMAIL_USER/EMAIL_APP_PASSWORD aren't
// set, this just logs to the console instead of failing the order.
//
// Setup (see server/.env.example):
// 1. Use a Gmail account (can be a new one just for this).
// 2. Turn on 2-Step Verification on that Google account.
// 3. Create an "App Password" (Google Account → Security → App Passwords).
// 4. Put the Gmail address in EMAIL_USER and the 16-character app password
//    in EMAIL_APP_PASSWORD — NOT your normal Gmail password.

const nodemailer = require("nodemailer");

const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD;

let transporter = null;
if (hasEmailConfig) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

exports.sendOrderConfirmationEmail = async (order) => {
  const productLines = order.products
    .map((p) => `  - ${p.name} × ${p.qty} — ₹${p.price * p.qty}`)
    .join("\n");

  const paymentLine =
    order.paymentMethod === "UPI"
      ? `Payment: UPI (Ref: ${order.upiTransactionRef || "—"}) — pending verification`
      : "Payment: Cash on Delivery";

  const body = `Hi ${order.customerName || "there"},

Thank you for your order from Golden Plaza!

Order ID: ${order._id}
${productLines}

Total: ₹${order.totalAmount}
${paymentLine}

Delivery Address:
${order.addressDetails}
Pincode: ${order.pincode}

We'll notify you as your order progresses. You can also check live updates
via the notification bag icon on our website.

— Golden Plaza`;

  if (!hasEmailConfig) {
    console.log(`[MOCK EMAIL to ${order.email}]:\n${body}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"Golden Plaza" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject: `Order Confirmed — Golden Plaza (#${order._id})`,
      text: body,
    });
    return true;
  } catch (err) {
    console.error("Failed to send order confirmation email:", err.message);
    console.log(`[EMAIL SEND FAILED — content was]:\n${body}`);
    return false;
  }
};

// Alerts the owner the instant a new order comes in — a free substitute
// for SMS, reusing the same Gmail setup. Sent to OWNER_EMAIL if set,
// otherwise falls back to EMAIL_USER (the shop's own inbox) so this works
// with zero extra configuration.
exports.sendOwnerNewOrderAlert = async (order) => {
  const ownerEmail = process.env.OWNER_EMAIL || process.env.EMAIL_USER;
  if (!ownerEmail) return true; // nothing configured — skip silently

  const productLines = order.products
    .map((p) => `  - ${p.name} × ${p.qty} — ₹${p.price * p.qty}`)
    .join("\n");

  const paymentLine =
    order.paymentMethod === "UPI"
      ? `UPI (Ref: ${order.upiTransactionRef || "—"}) — needs verification`
      : "Cash on Delivery";

  const body = `New order received on Golden Plaza!

Order ID: ${order._id}
Customer: ${order.customerName || "—"} (${order.customerMobile || "—"})
Email: ${order.email}

${productLines}

Total: ₹${order.totalAmount}
Payment: ${paymentLine}

Deliver to:
${order.addressDetails}
Pincode: ${order.pincode}

Open the Owner Dashboard to manage this order.`;

  if (!hasEmailConfig) {
    console.log(`[MOCK OWNER ALERT to ${ownerEmail}]:\n${body}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"Golden Plaza Orders" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: `🛍️ New Order #${order._id} — ₹${order.totalAmount}`,
      text: body,
    });
    return true;
  } catch (err) {
    console.error("Failed to send owner order alert:", err.message);
    return false;
  }
};
