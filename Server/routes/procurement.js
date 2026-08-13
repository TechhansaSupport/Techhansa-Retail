const express = require('express');
const router = express.Router();
const RFP = require('../models/RFP');
const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const CompanySettings = require('../models/CompanySettings');
const CreditTransaction = require('../models/CreditTransaction');

async function generateInvoiceNumber() {
  let stateCode = 'DL'; // default
  const settings = await CompanySettings.findOne();

  if (settings) {
    const addr = (settings.stateName || settings.registeredAddress || '').toUpperCase();
    if (addr.includes('UTTAR PRADESH') || addr.includes(' UP') || addr.includes('U.P') || addr.includes(', UP')) stateCode = 'UP';
    else if (addr.includes('MADHYA PRADESH') || addr.includes(' MP') || addr.includes('M.P')) stateCode = 'MP';
    else if (addr.includes('RAJASTHAN') || addr.includes(' RJ') || addr.includes('R.J')) stateCode = 'RJ';
    else if (addr.includes('MAHARASHTRA') || addr.includes(' MH') || addr.includes('M.H')) stateCode = 'MH';
    else if (addr.includes('GUJARAT') || addr.includes(' GJ') || addr.includes('G.J')) stateCode = 'GJ';
    else if (addr.includes('HARYANA') || addr.includes(' HR') || addr.includes('H.R')) stateCode = 'HR';
    else if (addr.includes('KARNATAKA') || addr.includes(' KA') || addr.includes('K.A')) stateCode = 'KA';
    else if (addr.includes('DELHI') || addr.includes(' DL') || addr.includes('D.L')) stateCode = 'DL';
  }

  const date = new Date();
  const month = date.getMonth(); // 0-11
  const year = date.getFullYear();
  let startYear, endYear;
  if (month >= 3) {
    startYear = year.toString().slice(-2);
    endYear = (year + 1).toString().slice(-2);
  } else {
    startYear = (year - 1).toString().slice(-2);
    endYear = year.toString().slice(-2);
  }
  const fy = `${startYear}-${endYear}`;

  const prefix = `THS-${stateCode}-${fy}`;
  const lastInvoice = await Invoice.findOne({ invoiceNumber: new RegExp(`^${prefix}-`) }).sort({ createdAt: -1 });
  let seq = 1;
  if (lastInvoice) {
    const parts = lastInvoice.invoiceNumber.split('-');
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) seq = lastSeq + 1;
  }
  const seqStr = seq.toString().padStart(3, '0');
  return `${prefix}-${seqStr}`;
}

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

    // Calculate total spending (actual deducted credit)
    const user = await User.findOne({ userId });
    const totalSpending = user?.usedCredit || 0;

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
        invoiceNumber: await generateInvoiceNumber(),
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

// GET specific Order by orderNumber (with deep population)
router.get('/orders/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate({
        path: 'quotationReference',
        populate: {
          path: 'rfpReference'
        }
      });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all Invoices
router.get('/invoices', async (req, res) => {
  try {
    if (!req.query.userId) return res.json([]);
    const filter = { userId: req.query.userId };
    const invoices = await Invoice.find(filter)
      .populate({
        path: 'orderReference',
        populate: {
          path: 'quotationReference',
          populate: {
            path: 'rfpReference'
          }
        }
      })
      .sort({ createdAt: -1 });
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
          invoiceNumber: await generateInvoiceNumber(),
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

// POST new Order (Checkout)
router.post('/orders', async (req, res) => {
  try {
    const { 
      quotationReference, 
      expectedDelivery, 
      totalAmount, 
      paymentMethod, 
      utrNumber, 
      transactionDate, 
      receiptUrl, 
      userId 
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    let paymentStatus = 'None';
    const orderNumber = `ORD-${Date.now()}`;

    if (paymentMethod === 'Credit') {
      const user = await User.findOne({ userId });
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      const availableCredit = (user.totalCredit || 0) - (user.usedCredit || 0) - (user.reservedCredit || 0);
      if (availableCredit < totalAmount) {
        return res.status(400).json({ error: 'Insufficient Credit Limit' });
      }

      // Reserve the credit
      user.reservedCredit = (user.reservedCredit || 0) + totalAmount;
      await user.save();
      paymentStatus = 'Reserved';

      // Record transaction
      const transaction = new CreditTransaction({
        userId,
        type: 'Reserved',
        amount: totalAmount,
        referenceId: orderNumber,
        description: `Reserved credit for Order ${orderNumber}`
      });
      await transaction.save();

    } else if (paymentMethod === 'NEFT' || paymentMethod === 'UPI' || paymentMethod === 'Advance Payment') {
      paymentStatus = 'Pending Verification';
    }

    const newOrder = new Order({
      orderNumber,
      quotationReference, // Can be null if they skip quotation
      expectedDelivery: expectedDelivery || new Date(),
      status: 'Pending',
      totalAmount,
      paymentMethod,
      paymentStatus,
      utrNumber,
      transactionDate,
      receiptUrl,
      userId
    });

    await newOrder.save();
    res.status(201).json(newOrder);

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET Credit Transactions
router.get('/credit-transactions', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    
    const transactions = await CreditTransaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching credit transactions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
