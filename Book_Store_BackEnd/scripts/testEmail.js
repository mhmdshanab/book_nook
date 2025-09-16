require('dotenv').config();
const { sendEmail } = require('../utils/mailer');

async function main() {
  const [, , to = process.env.EMAIL_USER, subject = 'Test Email', text = 'This is a test email from Book Store'] = process.argv;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Missing EMAIL_USER/EMAIL_PASS in environment.');
    process.exit(1);
  }

  try {
    await sendEmail(to, subject, text);
    console.log('Email sent successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to send email:', err.message);
    process.exit(1);
  }
}

main();



