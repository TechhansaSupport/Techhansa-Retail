const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Quotation = require('../models/Quotation');
const B2BInvoice = require('../models/B2BInvoice');
const ProcurementRequest = require('../models/ProcurementRequest');
const { verifyAdminToken } = require('../middleware/auth');

// GET pending payments
router.get('/pending-payments', verifyAdminToken, async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: { $in: ['Pending Verification', 'Paid', 'Rejected'] } }).limit(100);
    const b2bInvoices = await B2BInvoice.find({ status: { $in: ['Payment Verification', 'Paid', 'Rejected'] } }).limit(100);
    const quotations = await Quotation.find({ 
      paymentStatus: { $in: ['Pending Verification', 'Paid', 'Rejected'] },
      procurementReference: { $exists: true, $ne: null }
    }).limit(100);

    const formattedOrders = orders.map(o => ({
      _id: o._id,
      transactionId: o.orderNumber,
      orderType: 'Channel Order',
      date: o.transactionDate || o.createdAt,
      amount: o.totalAmount,
      utrNumber: o.utrNumber,
      receiptUrl: o.receiptUrl,
      paymentMethod: o.paymentMethod,
      status: o.paymentStatus,
      storeId: o.userId || 'N/A',
      invoiceSent: ['Processing', 'Dispatched', 'Out for Delivery', 'Delivered'].includes(o.status)
    }));

    const formattedQuotations = quotations.map(q => ({
      _id: q._id,
      transactionId: q.quotationNo,
      orderType: 'Franchise Quotation Order',
      date: q.transactionDate || q.createdAt,
      amount: q.amount,
      utrNumber: q.utrNumber,
      receiptUrl: '', // Assuming Quotation doesn't have receiptUrl
      paymentMethod: q.paymentMethod,
      status: q.paymentStatus,
      storeId: q.storeId || q.userId || 'N/A',
      invoiceSent: false
    }));

    const formattedInvoices = b2bInvoices.map(inv => ({
      _id: inv._id,
      transactionId: inv.invoiceNo,
      orderType: 'Franchise B2B Invoice',
      date: inv.paymentDetails?.date || inv.updatedAt,
      amount: inv.amount,
      utrNumber: inv.paymentDetails?.utr || 'N/A',
      receiptUrl: inv.paymentDetails?.receipt || '',
      paymentMethod: inv.paymentDetails?.method || 'Advance Payment',
      status: inv.status,
      storeId: inv.storeId,
      invoiceSent: inv.invoiceSent || false
    }));

    res.json([...formattedOrders, ...formattedQuotations, ...formattedInvoices].sort((a, b) => {
      const aPending = (a.status === 'Pending Verification' || a.status === 'Payment Verification') ? 2 : (a.status === 'Rejected' ? 1 : 0);
      const bPending = (b.status === 'Pending Verification' || b.status === 'Payment Verification') ? 2 : (b.status === 'Rejected' ? 1 : 0);
      if (aPending !== bPending) return bPending - aPending; // Pending Verification first, then Rejected, then Paid
      return new Date(b.date) - new Date(a.date); // Then sort by date descending
    }));
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST approve payment
router.post('/approve/:type/:id', verifyAdminToken, async (req, res) => {
  try {
    const { type, id } = req.params;
    
    if (type === 'Channel Order') {
      await Order.findByIdAndUpdate(id, { paymentStatus: 'Paid', status: 'Paid' });
    } else if (type === 'Franchise Quotation Order') {
      const quotation = await Quotation.findByIdAndUpdate(id, { paymentStatus: 'Paid' });
      if (quotation && quotation.procurementReference) {
        const pr = await ProcurementRequest.findById(quotation.procurementReference);
        if (pr) {
          pr.status = 'Paid';
          await pr.save();
        }
      }
    } else { // Franchise B2B Invoice
      const inv = await B2BInvoice.findByIdAndUpdate(id, { status: 'Paid' });
      if (inv && inv.requestId) {
        await ProcurementRequest.findOneAndUpdate({ requestId: inv.requestId }, { status: 'DISPATCHED' });
      }
    }
    
    res.json({ success: true, message: 'Payment approved successfully.' });
  } catch (error) {
    console.error('Error approving payment:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST reject payment
router.post('/reject/:type/:id', verifyAdminToken, async (req, res) => {
  try {
    const { type, id } = req.params;
    
    if (type === 'Channel Order') {
      await Order.findByIdAndUpdate(id, { paymentStatus: 'Rejected' });
    } else if (type === 'Franchise Quotation Order') {
      const quotation = await Quotation.findByIdAndUpdate(id, { paymentStatus: 'Rejected' });
      if (quotation && quotation.procurementReference) {
        const pr = await ProcurementRequest.findById(quotation.procurementReference);
        if (pr) {
          pr.status = 'PAYMENT_REJECTED';
          await pr.save();
        }
      }
    } else {
      const inv = await B2BInvoice.findByIdAndUpdate(id, { status: 'Rejected' });
      if (inv && inv.requestId) {
        await ProcurementRequest.findOneAndUpdate({ requestId: inv.requestId }, { status: 'PAYMENT_REJECTED' });
      }
    }
    
    res.json({ success: true, message: 'Payment rejected.' });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
