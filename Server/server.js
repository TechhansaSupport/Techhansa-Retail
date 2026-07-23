require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Import Routes
const contactRoute = require('./routes/contact');
const franchiseRoute = require('./routes/franchise');
const channelRoute = require('./routes/channel');

// Use Routes
app.use('/api/contact', contactRoute);
app.use('/api/franchise', franchiseRoute);
app.use('/api/channel', channelRoute);

// Initialize Database & Start Server
async function startServer() {
  try {
    // Test DB connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected successfully at:', result.rows[0].now);

    // Create contacts table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        business_type VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Contacts table is ready');

    // Drop old tables if they exist
    await pool.query(`DROP TABLE IF EXISTS franchise_directors CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS franchise_applications CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS channel_directors CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS channel_partner CASCADE;`);

    // Create channel_partner table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS channel_partner (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        cin_gst VARCHAR(100),
        company_pan VARCHAR(50),
        company_tan VARCHAR(50),
        registered_address TEXT NOT NULL,
        company_contact VARCHAR(50) NOT NULL,
        auth_name VARCHAR(255) NOT NULL,
        auth_contact VARCHAR(50) NOT NULL,
        auth_email VARCHAR(255) NOT NULL,
        document_path TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Channel Partner table is ready');

    // Create channel_directors table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS channel_directors (
        id SERIAL PRIMARY KEY,
        channel_partner_id INTEGER REFERENCES channel_partner(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        contact VARCHAR(50) NOT NULL,
        income_amount VARCHAR(50),
        income_unit VARCHAR(50),
        aadhar VARCHAR(50) NOT NULL,
        pan VARCHAR(50) NOT NULL,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Channel Directors table is ready');

    // Create franchise_partner table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS franchise_partner (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        dob DATE,
        contact_number VARCHAR(50) NOT NULL,
        pan_card VARCHAR(50),
        aadhar_card VARCHAR(50),
        permanent_address TEXT NOT NULL,
        occupation VARCHAR(255),
        company_name VARCHAR(255),
        designation VARCHAR(255),
        experience VARCHAR(255),
        message TEXT,
        account_number VARCHAR(100),
        ifsc_code VARCHAR(50),
        bank_address TEXT,
        bank_name VARCHAR(255),
        document_path TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Franchise Partner table is ready');

    // Start server only after DB is confirmed
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error.message);
    console.error('   Check your .env file and make sure PostgreSQL is running.');
    process.exit(1);
  }
}

startServer();