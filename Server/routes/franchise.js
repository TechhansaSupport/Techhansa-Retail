const express = require('express');
const router = express.Router();
// const pool = require('../db');
const FranchisePartner = require('../models/FranchisePartner');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/franchise');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const uploaderName = (req.body.name || 'franchise').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    cb(null, uploaderName + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.zip') {
      return cb(new Error('Only PDF and ZIP files are allowed'));
    }
    cb(null, true);
  }
});

router.post('/apply', upload.single('documents'), async (req, res) => {
  /* POSTGRES LOGIC COMMENTED OUT
  const client = await pool.connect();

  try {
    const {
      name, dob, contactNumber, panCard, aadharCard, permanentAddress,
      occupation, companyName, designation, experience,
      message,
      accountNumber, ifscCode, bankAddress, bankName
    } = req.body;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const documentPath = req.file ? `${baseUrl}/uploads/franchise/${req.file.filename}` : null;

    // 1. Insert Franchise Partner Application
    const applicationQuery = `
      INSERT INTO franchise_partner 
      (name, dob, contact_number, pan_card, aadhar_card, permanent_address, occupation, company_name, designation, experience, message, account_number, ifsc_code, bank_address, bank_name, document_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id;
    `;
    const applicationValues = [
      name, dob, contactNumber, panCard, aadharCard, permanentAddress,
      occupation, companyName, designation, experience,
      message,
      accountNumber, ifscCode, bankAddress, bankName, documentPath
    ];

    const appResult = await client.query(applicationQuery, applicationValues);
    const applicationId = appResult.rows[0].id;
  */

  try {
    const {
      name, dob, contactNumber, panCard, aadharCard, permanentAddress,
      occupation, companyName, designation, experience,
      message,
      accountNumber, ifscCode, bankAddress, bankName
    } = req.body;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const documentPath = req.file ? `${baseUrl}/uploads/franchise/${req.file.filename}` : null;

    // 1. Insert Franchise Partner Application using MongoDB
    const newApplication = await FranchisePartner.create({
      name, dob, contactNumber, panCard, aadharCard, permanentAddress,
      occupation, companyName, designation, experience,
      message,
      accountNumber, ifscCode, bankAddress, bankName, documentPath
    });
    const applicationId = newApplication._id;

    // Send Email Notification
    try {
      let attachments = [];
      if (req.file && fs.existsSync(req.file.path)) {
        attachments.push({
          filename: req.file.originalname,
          content: fs.readFileSync(req.file.path)
        });
      }

      await resend.emails.send({
        from: 'Techhansa Notifications <onboarding@resend.dev>',
        to: 'customer.support@techhansha.com',
        subject: 'Notification from Franchise Partner Form',
        html: `
          <h2>New Franchise Partner Application</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>DOB:</strong> ${dob}</p>
          <p><strong>Contact Number:</strong> ${contactNumber}</p>
          <p><strong>PAN:</strong> ${panCard}</p>
          <p><strong>Aadhar:</strong> ${aadharCard}</p>
          <p><strong>Address:</strong> ${permanentAddress}</p>
          <p><strong>Occupation:</strong> ${occupation}</p>
          <p><strong>Company:</strong> ${companyName || 'N/A'}</p>
          <p><strong>Designation:</strong> ${designation || 'N/A'}</p>
          <p><strong>Experience:</strong> ${experience || 'N/A'}</p>
          <p><strong>Bank Name:</strong> ${bankName}</p>
          <p><strong>Account Number:</strong> ${accountNumber}</p>
          <p><strong>IFSC:</strong> ${ifscCode}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
        attachments
      });
      console.log("✅ Franchise Email sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send franchise email:", emailError);
    }

    res.status(201).json({ 
      success: true, 
      message: 'Franchise application submitted successfully',
      applicationId 
    });

  } catch (error) {
    console.error('Error submitting franchise application:', error);
    
    // Clean up uploaded file if DB insertion failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error while submitting application',
      error: error.message
    });
  }
  /* POSTGRES FINALLY LOGIC COMMENTED OUT
  finally {
    client.release();
  }
  */
});

module.exports = router;
