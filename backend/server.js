const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Log environment variables for debugging
console.log('Server configuration:', {
  PORT: process.env.PORT,
  // Don't log any sensitive information
});

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Email sending endpoint
app.post('/api/send-email', upload.array('attachments'), async (req, res) => {
  try {
    const { to, cc, bcc, subject, content } = req.body;
    const attachments = req.files || [];

    // Prepare attachments for email
    const emailAttachments = attachments.map(file => ({
      filename: file.originalname,
      path: file.path
    }));

    // Send email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      cc: cc || undefined,
      bcc: bcc || undefined,
      subject,
      html: content,
      attachments: emailAttachments
    });

    // Clean up uploaded files
    attachments.forEach(file => {
      fs.unlinkSync(file.path);
    });

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 