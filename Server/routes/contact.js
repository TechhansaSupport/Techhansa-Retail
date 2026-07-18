const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const pool = require('../db'); // DB connection import kiya
require('dotenv').config();

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST Route: Save to DB & Send Email
router.post('/', async (req, res) => {
  const { fullName, companyName, email, phone, businessType, subject, message } = req.body;

  // Validation
  if (!fullName || !email || !phone || !businessType || !subject || !message) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  try {
    // 1. Save data to PostgreSQL Database
    const insertQuery = `
      INSERT INTO contacts (full_name, company_name, email, phone, business_type, subject, message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const dbValues = [fullName, companyName || null, email, phone, businessType, subject, message];
    
    // DB me query execute karna
    const newContact = await pool.query(insertQuery, dbValues);
    console.log("Saved to DB:", newContact.rows[0]);

    // 2. Send Email notification
    const mailOptions = {
      from: `"${fullName}" <${email}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Lead: ${subject} - from ${fullName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Company:</strong> ${companyName || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Business Type:</strong> ${businessType}</p>
        <br />
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // 3. Send Success Response to Frontend
    res.status(200).json({ message: 'Message sent and saved successfully!' });

  } catch (error) {
    console.error('Error in contact route:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;