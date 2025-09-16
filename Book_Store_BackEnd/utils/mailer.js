require('dotenv').config();
const nodemailer = require('nodemailer');

const {
  EMAIL_SERVICE = 'gmail',
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM
} = process.env;

// Build transporter: prefer explicit host/port when provided, otherwise fall back to well-known service (e.g., gmail)
const transporter = nodemailer.createTransport(
  EMAIL_HOST
    ? {
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT) || 587,
        secure: EMAIL_SECURE === 'true' || Number(EMAIL_PORT) === 465,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      }
    : {
        service: EMAIL_SERVICE,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      }
);

// Optional: verify transporter on startup to surface config issues early (non-fatal)
transporter
  .verify()
  .then(() => console.log('📨 Mail transporter verified and ready'))
  .catch((err) => console.warn('⚠️ Mail transporter verification failed:', err.message));

// sendEmail supports both positional args (to, subject, text) and an options object
// Options can include: to, subject, text, html, attachments, cc, bcc, replyTo, from
async function sendEmail(toOrOptions, subject, text) {
  const defaultFrom = EMAIL_FROM || `Book Store <${EMAIL_USER}>`;

  const mailOptions =
    toOrOptions && typeof toOrOptions === 'object' && !Array.isArray(toOrOptions)
      ? { from: defaultFrom, ...toOrOptions }
      : { from: defaultFrom, to: toOrOptions, subject, text };

  // Let errors bubble so callers can .catch(...)
  await transporter.sendMail(mailOptions);
  console.log('✅ Email sent to:', mailOptions.to);
  return true;
}

module.exports = { sendEmail, transporter };
