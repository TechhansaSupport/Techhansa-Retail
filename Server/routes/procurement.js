const express = require('express');
const router = express.Router();
const RFP = require('../models/RFP');
const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');

// GET Dashboard Stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const pendingRFPs = await RFP.countDocuments({ status: { $in: ['Draft', 'Submitted', 'Under Review'] } });
    const approvedOrders = await Order.countDocuments({ status: 'Confirmed' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const totalInvoices = await Invoice.countDocuments();
    
    // Calculate total spending (sum of all Invoice amounts)
    const invoices = await Invoice.find();
    const totalSpending = invoices.reduce((acc, curr) => acc + curr.amount, 0);

    res.json({
      pendingRFPs,
      approvedOrders,
      deliveredOrders,
      totalInvoices,
      totalSpending
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all RFPs
router.get('/rfp', async (req, res) => {
  try {
    const rfps = await RFP.find().sort({ createdAt: -1 });
    res.json(rfps);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new RFP
router.post('/rfp', async (req, res) => {
  try {
    const newRFP = new RFP(req.body);
    await newRFP.save();
    res.status(201).json(newRFP);
  } catch (error) {
    console.error('Error creating RFP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all Quotations
router.get('/quotations', async (req, res) => {
  try {
    const quotations = await Quotation.find().populate('rfpReference').sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('quotationReference').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all Invoices
router.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('orderReference').sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
