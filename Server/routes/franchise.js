const express = require('express');
const router = express.Router();
// const pool = require('../db');
const FranchisePartner = require('../models/FranchisePartner');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
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

const StoreProfile = require('../models/StoreProfile');
const WalletTransaction = require('../models/WalletTransaction');
const B2BInvoice = require('../models/B2BInvoice');
const TechhansaCatalog = require('../models/TechhansaCatalog');
const User = require('../models/User');

// --- NEW API ENDPOINTS FOR FRANCHISE PORTAL ---

// 1. Get Store Profile & Metrics
router.get('/:storeId/profile', async (req, res) => {
  try {
    const profile = await StoreProfile.findOne({ storeId: req.params.storeId }).lean();
    if (!profile) return res.status(404).json({ success: false, message: 'Store not found' });
    
    // Map credit logic to walletBalance for frontend compatibility
    profile.walletBalance = (profile.totalCredit || 0) - (profile.usedCredit || 0) - (profile.reservedCredit || 0);
    
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching store profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 2. Get Wallet Transactions
router.get('/:storeId/wallet', async (req, res) => {
  try {
    const transactions = await WalletTransaction.find({ storeId: req.params.storeId }).sort({ date: -1 });
    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// Removed: Add Funds to Wallet (Button removed per user request)

// 4. Get B2B Invoices
router.get('/:storeId/b2b-invoices', async (req, res) => {
  try {
    const invoices = await B2BInvoice.find({ storeId: req.params.storeId }).sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (error) {
    console.error('Error fetching b2b invoices:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 5. Approve B2B Invoice
router.put('/:storeId/b2b-invoices/:id/approve', async (req, res) => {
  try {
    const { storeId, id } = req.params;
    
    const invoice = await B2BInvoice.findById(id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    if (invoice.status === 'Paid') return res.status(400).json({ success: false, message: 'Invoice already paid' });
    if (invoice.storeId !== storeId) return res.status(403).json({ success: false, message: 'Unauthorized' });
    
    const profile = await StoreProfile.findOne({ storeId });
    if (!profile) return res.status(404).json({ success: false, message: 'Store not found' });
    
    const availableCredit = (profile.totalCredit || 0) - (profile.usedCredit || 0) - (profile.reservedCredit || 0);
    
    // In original request, credit was reserved.
    // If invoice amount is different, we adjust usedCredit but how much was reserved?
    // We assume the original request total was reserved, we can deduct the invoice amount from reserved? 
    // Wait, the safest way is just to add invoice.amount to usedCredit, and look up the original request to deduct the reserved amount.
    const ProcurementRequest = require('../models/ProcurementRequest');
    let originalReserved = invoice.amount; // default fallback
    
    if (invoice.requestId) {
       const reqst = await ProcurementRequest.findOne({ requestId: invoice.requestId });
       if (reqst) {
          originalReserved = reqst.total || invoice.amount;
          reqst.status = 'DISPATCHED';
          await reqst.save();
       }
    }

    // Adjust credits
    profile.reservedCredit = Math.max(0, (profile.reservedCredit || 0) - originalReserved);
    profile.usedCredit = (profile.usedCredit || 0) + invoice.amount;
    await profile.save();
    
    // Update invoice
    invoice.status = 'Paid';
    await invoice.save();

    // Log transaction
    const newBalance = profile.totalCredit - profile.usedCredit - profile.reservedCredit;
    const txn = new WalletTransaction({
      storeId,
      txnId: `TXN-${Date.now()}`,
      type: 'Deducted',
      amount: invoice.amount,
      closingBalance: newBalance
    });
    await txn.save();
    
    res.json({ success: true, invoice, newBalance, transaction: txn });
  } catch (error) {
    console.error('Error approving b2b invoice:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 6. Get Employees
router.get('/:storeId/employees', async (req, res) => {
  try {
    const employees = await User.find({ storeId: req.params.storeId, role: 'employee' }).sort({ createdAt: -1 });
    res.json({ success: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create Employee
router.post('/:storeId/employees', async (req, res) => {
  try {
    const { userId, password, name, phone, email } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User ID already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newEmployee = new User({
      userId,
      password: hashedPassword,
      name,
      phone,
      email,
      role: 'employee',
      storeId: req.params.storeId,
      status: 'Active'
    });

    await newEmployee.save();
    res.status(201).json({ success: true, data: newEmployee });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ success: false, message: 'Server error creating employee' });
  }
});

// Toggle Employee Status
router.put('/:storeId/employees/:id/status', async (req, res) => {
  try {
    const employee = await User.findOne({ _id: req.params.id, storeId: req.params.storeId, role: 'employee' });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee.status = employee.status === 'Active' ? 'Inactive' : 'Active';
    await employee.save();

    res.json({ success: true, data: employee });
  } catch (error) {
    console.error('Error toggling employee status:', error);
    res.status(500).json({ success: false, message: 'Server error toggling status' });
  }
});

const ProcurementRequest = require('../models/ProcurementRequest');

// 8. Get Procurement Requests
router.get('/:storeId/requests', async (req, res) => {
  try {
    const requests = await ProcurementRequest.find({ storeId: req.params.storeId }).sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching procurement requests:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 9. Create Procurement Request
router.post('/:storeId/requests', async (req, res) => {
  try {
    const { items, total, date } = req.body;
    const storeId = req.params.storeId;
    
    // Auto-increment logic
    const lastRequest = await ProcurementRequest.findOne().sort({ createdAt: -1 });
    let nextNum = 1;
    if (lastRequest && lastRequest.requestId && lastRequest.requestId.startsWith('REQ-')) {
      const match = lastRequest.requestId.match(/REQ-(\d+)/);
      if (match) {
        // If there are existing requests that have giant timestamp IDs, we might want to start fresh 
        // or just increment from the last small number. Let's handle parsing carefully.
        const parsed = parseInt(match[1]);
        // If it's a timestamp ID (length > 6), maybe default to 1 or ignore it, but for now we just increment
        // It's safer to just increment what we find. If they have 'REQ-17866...', next will be 'REQ-17866...+1'
        // But the user specifically wants REQ-001. We can just count documents as a fallback or enforce 3 digits.
        if (parsed > 1000000) {
           // It's a timestamp, let's start fresh based on count
           const count = await ProcurementRequest.countDocuments();
           nextNum = count + 1;
        } else {
           nextNum = parsed + 1;
        }
      }
    }
    const requestId = `REQ-${String(nextNum).padStart(3, '0')}`;
    
    // Credit Limit Logic
    const profile = await StoreProfile.findOne({ storeId });
    if (!profile) return res.status(404).json({ success: false, message: 'Store not found' });
    
    const availableCredit = (profile.totalCredit || 0) - (profile.usedCredit || 0) - (profile.reservedCredit || 0);
    if (availableCredit < total) {
      return res.status(400).json({ success: false, message: 'Insufficient Available Credit' });
    }
    
    // Reserve credit
    profile.reservedCredit = (profile.reservedCredit || 0) + total;
    await profile.save();
    
    const newBalance = profile.totalCredit - profile.usedCredit - profile.reservedCredit;
    
    // Log reservation transaction
    const txn = new WalletTransaction({
      storeId,
      txnId: `TXN-${Date.now()}`,
      type: 'Reserved',
      amount: total,
      closingBalance: newBalance
    });
    await txn.save();

    const newRequest = new ProcurementRequest({
      storeId,
      requestId,
      date,
      items,
      total
    });
    
    await newRequest.save();
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    console.error('Error creating procurement request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 7. Get Techhansa Catalog
router.get('/catalog/all', async (req, res) => {
  try {
    const catalog = await TechhansaCatalog.find({});
    res.json({ success: true, data: catalog });
  } catch (error) {
    console.error('Error fetching catalog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
