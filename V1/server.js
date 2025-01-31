const express = require('express');
const cors = require('cors');
const EasyMailer = require('./EasyMailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize EasyMailer with credentials from environment variables
const mailer = new EasyMailer(
  process.env.EMAIL_USER,
  process.env.EMAIL_PASS
);

app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, template, templateData } = req.body;

    // Validate required fields
    if (!to || !template) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let emailContent;
    switch (template) {
      case 'welcome':
        emailContent = `
          <h1>Welcome to EasyMailer!</h1>
          <p>Hello ${templateData.name || 'there'},</p>
          <p>Thank you for trying out our demo. This is a test email sent using EasyMailer.</p>
        `;
        break;
      case 'reset':
        emailContent = `
          <h1>Password Reset</h1>
          <p>Hello ${templateData.name || 'there'},</p>
          <p>This is a demo of a password reset email template.</p>
        `;
        break;
      case 'promo':
        emailContent = `
          <h1>Special Offer!</h1>
          <p>Hello ${templateData.name || 'there'},</p>
          <p>This is a demo of a promotional email template.</p>
        `;
        break;
      default:
        emailContent = `
          <h1>Test Email</h1>
          <p>This is a test email sent using EasyMailer.</p>
        `;
    }

    const result = await mailer.sendEmail({
      to,
      subject: subject || `EasyMailer Demo - ${template} Template`,
      body: emailContent
    });

    res.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 45701;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});