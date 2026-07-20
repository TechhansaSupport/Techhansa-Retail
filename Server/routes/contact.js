const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST Route: Save to DB
router.post('/', async (req, res) => {
  const { fullName, companyName, email, phone, businessType, subject, message } = req.body;

  // Validation
  if (!fullName || !email || !phone || !businessType || !subject || !message) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  try {
    const insertQuery = `
      INSERT INTO contacts (full_name, company_name, email, phone, business_type, subject, message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const dbValues = [fullName, companyName || null, email, phone, businessType, subject, message];
    
    const newContact = await pool.query(insertQuery, dbValues);
    console.log("✅ Saved to DB:", newContact.rows[0]);

    res.status(200).json({ message: 'Message saved successfully!' });

  } catch (error) {
    console.error('❌ Error in contact route:', error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;