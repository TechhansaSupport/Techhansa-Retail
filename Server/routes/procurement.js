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

    // Create placeholder Quotation
    const newQuotation = new Quotation({
      quotationNo: `QT-${newRFP.rfpId}`,
      rfpReference: newRFP._id,
      vendor: 'TBD',
      amount: 0,
      validUntil: newRFP.expectedDeliveryDate,
      status: 'Pending'
    });
    await newQuotation.save();

    // Create placeholder Order
    const newOrder = new Order({
      orderNumber: `ORD-${newRFP.rfpId}`,
      quotationReference: newQuotation._id,
      expectedDelivery: newRFP.expectedDeliveryDate,
      status: 'Pending'
    });
    await newOrder.save();

    // Create placeholder Invoice
    const newInvoice = new Invoice({
      invoiceNumber: `INV-${newRFP.rfpId}`,
      orderReference: newOrder._id,
      amount: 0,
      paymentStatus: 'Unpaid'
    });
    await newInvoice.save();

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

// PUT update RFP
router.put('/rfp/:id', async (req, res) => {
  try {
    const updatedRFP = await RFP.findOneAndUpdate({ rfpId: req.params.id }, req.body, { new: true });
    if (!updatedRFP) {
      return res.status(404).json({ error: 'RFP not found' });
    }
    res.json(updatedRFP);
  } catch (error) {
    console.error('Error updating RFP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE RFP
router.delete('/rfp/:id', async (req, res) => {
  try {
    const deletedRFP = await RFP.findOneAndDelete({ rfpId: req.params.id });
    if (!deletedRFP) {
      return res.status(404).json({ error: 'RFP not found' });
    }
    res.json({ message: 'RFP deleted successfully' });
  } catch (error) {
    console.error('Error deleting RFP:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
