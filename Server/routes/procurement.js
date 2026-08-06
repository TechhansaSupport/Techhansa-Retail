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

    if (newRFP.status !== 'Draft') {
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
    }

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
    const oldRFP = await RFP.findOne({ rfpId: req.params.id });
    if (!oldRFP) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    const updatedRFP = await RFP.findOneAndUpdate({ rfpId: req.params.id }, req.body, { returnDocument: 'after' });

    // Create placeholders if transitioning from Draft
    if (oldRFP.status === 'Draft' && updatedRFP.status !== 'Draft') {
      const existingQuotation = await Quotation.findOne({ quotationNo: `QT-${updatedRFP.rfpId}` });
      if (!existingQuotation) {
        const newQuotation = new Quotation({
          quotationNo: `QT-${updatedRFP.rfpId}`,
          rfpReference: updatedRFP._id,
          vendor: 'TBD',
          amount: 0,
          validUntil: updatedRFP.expectedDeliveryDate,
          status: 'Pending',
          userId: updatedRFP.userId
        });
        await newQuotation.save();

        const newOrder = new Order({
          orderNumber: `ORD-${updatedRFP.rfpId}`,
          quotationReference: newQuotation._id,
          expectedDelivery: updatedRFP.expectedDeliveryDate,
          status: 'Pending',
          userId: updatedRFP.userId
        });
        await newOrder.save();

        const newInvoice = new Invoice({
          invoiceNumber: `INV-${updatedRFP.rfpId}`,
          orderReference: newOrder._id,
          amount: 0,
          paymentStatus: 'Unpaid',
          userId: updatedRFP.userId
        });
        await newInvoice.save();
      }
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

// GET reports
router.get('/reports', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const filter = { userId };

    // Fetch all relevant data
    const invoices = await Invoice.find(filter);
    const orders = await Order.find(filter);
    const rfps = await RFP.find(filter);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Daily Metrics
    const todayInvoices = invoices.filter(i => new Date(i.createdAt) >= todayStart);
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= todayStart);
    const todayRfps = rfps.filter(r => new Date(r.createdAt) >= todayStart);

    const daily = {
      spend: todayInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
      orders: todayOrders.length,
      rfps: todayRfps.length,
      invoicesPaid: todayInvoices.filter(i => i.paymentStatus === 'Paid').length
    };

    // Monthly Metrics (Last 12 months)
    const monthly = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      const monthStart = d;
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const monthInvoices = invoices.filter(inv => {
        const date = new Date(inv.createdAt);
        return date >= monthStart && date <= monthEnd;
      });
      const spend = monthInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

      const monthOrders = orders.filter(o => {
        const date = new Date(o.createdAt);
        return date >= monthStart && date <= monthEnd;
      });

      monthly.push({
        name: monthName,
        spend: spend,
        orders: monthOrders.length
      });
    }

    // Yearly Metrics (Last 5 years)
    const yearly = [];
    for (let i = 4; i >= 0; i--) {
      const year = now.getFullYear() - i;
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, 11, 31, 23, 59, 59);

      const yearInvoices = invoices.filter(inv => {
        const date = new Date(inv.createdAt);
        return date >= yearStart && date <= yearEnd;
      });
      const spend = yearInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

      const yearOrders = orders.filter(o => {
        const date = new Date(o.createdAt);
        return date >= yearStart && date <= yearEnd;
      });

      yearly.push({
        name: year.toString(),
        spend: spend,
        orders: yearOrders.length
      });
    }

    res.json({ daily, monthly, yearly });
  } catch (error) {
    console.error('Error generating reports:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
