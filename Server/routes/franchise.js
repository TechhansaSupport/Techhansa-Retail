const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
    cb(null, 'franchise-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.zip') {
      return cb(new Error('Only PDF and ZIP files are allowed'));
    }
    cb(null, true);
  }
});

router.post('/apply', upload.single('documents'), async (req, res) => {
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
  } finally {
    client.release();
  }
});

module.exports = router;
