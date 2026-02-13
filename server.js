const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from your frontend (local static site, etc.)
app.use(cors());

// Parse incoming JSON bodies
app.use(express.json());

// Configure Zoho SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Health check route (optional, useful while testing)
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Email server is running' });
});

// Shared handler for contact form routes
async function handleContactForm(req, res) {
  try {
    const { name, email, message } = req.body;

    // Basic required-field validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'name, email, and message are required' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ success: false, error: 'EMAIL_USER and EMAIL_PASS are not configured' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false });
  }
}

// Primary endpoint used by the frontend
app.post('/api/contact', handleContactForm);

// Backward-compatible alias
app.post('/send-email', handleContactForm);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
