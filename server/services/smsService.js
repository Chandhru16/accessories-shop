// Sends real SMS via Twilio when TWILIO_* env vars are set.
// Falls back to console-logging the message (mock mode) if they're missing,
// so the app still works during local development without a Twilio account.

let twilioClient = null;
const hasTwilioConfig =
  process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER;

if (hasTwilioConfig) {
  const twilio = require("twilio");
  twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
}

exports.sendSMS = async (to, message) => {
  if (!hasTwilioConfig) {
    console.log(`[MOCK SMS to ${to}]: ${message}`);
    return true;
  }

  try {
    // Indian numbers need the +91 country code prefix for Twilio.
    const formattedTo = to.startsWith("+") ? to : `+91${to}`;
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedTo,
    });
    return true;
  } catch (err) {
    console.error(`Failed to send SMS to ${to}:`, err.message);
    // Still log the message so you can see the OTP/update during testing
    // even if the real send failed (e.g. unverified number on a trial account).
    console.log(`[SMS SEND FAILED — message was]: ${message}`);
    return false;
  }
};
