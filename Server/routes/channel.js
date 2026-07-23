const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/channel');
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
    cb(null, 'channel-' + uniqueSuffix + path.extname(file.originalname));
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
      companyName, cinGst, companyPan, companyTan, 
      registeredAddress, companyContact, authName, 
      authContact, authEmail, directors
    } = req.body;

    const documentPath = req.file ? req.file.path : null;

    // Start transaction
    await client.query('BEGIN');

    // 1. Insert Channel Partner Application
    const applicationQuery = `
      INSERT INTO channel_partner 
      (company_name, cin_gst, company_pan, company_tan, registered_address, company_contact, auth_name, auth_contact, auth_email, document_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id;
    `;
    const applicationValues = [
      companyName, cinGst, companyPan, companyTan, 
      registeredAddress, companyContact, authName, 
      authContact, authEmail, documentPath
    ];

    const appResult = await client.query(applicationQuery, applicationValues);
    const applicationId = appResult.rows[0].id;

    // 2. Insert Directors
    if (directors) {
      const directorsList = JSON.parse(directors);
      
      const directorQuery = `
        INSERT INTO channel_directors
        (channel_partner_id, name, email, contact, income_amount, income_unit, aadhar, pan, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;

      for (const dir of directorsList) {
        const dirValues = [
          applicationId,
          dir.name,
          dir.email,
          dir.contact,
          dir.incomeAmount,
          dir.incomeUnit,
          dir.aadhar,
          dir.pan,
          dir.address
        ];
        await client.query(directorQuery, dirValues);
      }
    }

    // Commit transaction
    await client.query('COMMIT');

    res.status(201).json({ 
      success: true, 
      message: 'Channel Partner application submitted successfully',
      applicationId 
    });

  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Error submitting channel partner application:', error);
    
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
