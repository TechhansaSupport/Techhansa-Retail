const express = require('express');
const router = express.Router();
const RFP = require('../models/RFP');
const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');

// GET Dashboard Stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.json({
        pendingRFPs: 0,
        approvedOrders: 0,
        deliveredOrders: 0,
        totalInvoices: 0,
        totalSpending: 0
      });
    }
    const filter = { userId };

    const pendingRFPs = await RFP.countDocuments({ ...filter, status: { $in: ['Draft', 'Submitted', 'Under Review'] } });
    const approvedOrders = await Order.countDocuments({ ...filter, status: 'Confirmed' });
    const deliveredOrders = await Order.countDocuments({ ...filter, status: 'Delivered' });
    const totalInvoices = await Invoice.countDocuments(filter);

    // Calculate total spending (sum of all Invoice amounts)
    const invoices = await Invoice.find(filter);
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
    if (!req.query.userId) return res.json([]);
    const filter = { userId: req.query.userId };
    const rfps = await RFP.find(filter).sort({ createdAt: -1 });
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
      status: 'Pending',
      userId: newRFP.userId
    });
    await newQuotation.save();

    // Create placeholder Order
    const newOrder = new Order({
      orderNumber: `ORD-${newRFP.rfpId}`,
      quotationReference: newQuotation._id,
      expectedDelivery: newRFP.expectedDeliveryDate,
      status: 'Pending',
      userId: newRFP.userId
    });
    await newOrder.save();

    // Create placeholder Invoice
    const newInvoice = new Invoice({
      invoiceNumber: `INV-${newRFP.rfpId}`,
      orderReference: newOrder._id,
      amount: 0,
      paymentStatus: 'Unpaid',
      userId: newRFP.userId
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
    if (!req.query.userId) return res.json([]);
    const filter = { userId: req.query.userId };
    const quotations = await Quotation.find(filter).populate('rfpReference').sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all Orders
router.get('/orders', async (req, res) => {
  try {
    if (!req.query.userId) return res.json([]);
    const filter = { userId: req.query.userId };
    const orders = await Order.find(filter).populate('quotationReference').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all Invoices
router.get('/invoices', async (req, res) => {
  try {
    if (!req.query.userId) return res.json([]);
    const filter = { userId: req.query.userId };
    const invoices = await Invoice.find(filter).populate('orderReference').sort({ createdAt: -1 });
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
