const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Resend } = require('resend');
const pool = require('../db'); 

// Initialize Resend SDK (uses HTTP port 443, bypassing SMTP blocks)
const resend = new Resend(process.env.RESEND_API_KEY);

// Configure Multer for memory storage (files kept as buffers)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  }
});

// POST /api/submissions
// upload.array('documents', 5) allows up to 5 files under the 'documents' field
router.post('/', upload.array('documents', 5), async (req, res) => {
  const { name, email, message } = req.body;
  const files = req.files || [];

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message.' });
  }

  // Extract file metadata for the database
  const attachmentsMetadata = files.map(file => ({
    filename: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  }));

  // Prepare attachments for Resend (requires filename and content buffer)
  const emailAttachments = files.map(file => ({
    filename: file.originalname,
    content: file.buffer // Send the raw buffer directly
  }));

  // Acquire a dedicated client for transaction handling
  const client = await pool.connect();

  try {
    // 1. Start Database Transaction
    await client.query('BEGIN');

    // 2. Insert into PostgreSQL
    const insertQuery = `
      INSERT INTO form_submissions (name, email, message, attachments_metadata)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const dbValues = [name, email, message, JSON.stringify(attachmentsMetadata)];
    const dbResult = await client.query(insertQuery, dbValues);
    const savedSubmission = dbResult.rows[0];

    // 3. Send Email via Resend HTTP API
    const emailResponse = await resend.emails.send({
      from: 'Acme Corp <onboarding@resend.dev>', // Replace with your verified sender domain
      to: ['team@yourcompany.com'], // The destination for the internal team notification
      subject: `New Form Submission from ${name}`,
      html: `
        <h2>New Submission Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      attachments: emailAttachments
    });

    if (emailResponse.error) {
      throw new Error(`Email sending failed: ${emailResponse.error.message}`);
    }

    // 4. Commit Database Transaction (Only if DB insert AND Email succeed)
    await client.query('COMMIT');

    res.status(200).json({ 
      success: true, 
      message: 'Submission saved and team notified successfully!',
      data: savedSubmission
    });

  } catch (error) {
    // 5. Rollback Transaction on any failure
    await client.query('ROLLBACK');
    console.error('Submission Error:', error);
    
    res.status(500).json({ 
      success: false, 
      error: 'An error occurred while processing your submission. Please try again.' 
    });
  } finally {
    // Release the client back to the pool
    client.release();
  }
});

module.exports = router;
