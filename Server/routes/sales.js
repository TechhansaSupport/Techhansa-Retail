const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

// POST checkout - reduces inventory and creates invoice
router.post('/checkout', async (req, res) => {
  try {
    const { cart, customer, employeeId, storeId } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let subtotal = 0;
    let totalQuantity = 0;

    // Verify and reduce inventory using atomic updates
    const deductedProducts = [];
    
    for (const item of cart) {
      // Find and deduct in one atomic operation
      const result = await Product.updateOne(
        { _id: item._id || item.id, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -item.quantity } }
      );

      if (result.modifiedCount === 0) {
        // Rollback already deducted products
        for (const deducted of deductedProducts) {
          await Product.updateOne(
            { _id: deducted._id },
            { $inc: { quantity: deducted.quantity } }
          );
        }
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.model} or product not found.` });
      }
      
      deductedProducts.push(item);
      subtotal += (item.sellingPrice * item.quantity);
      totalQuantity += item.quantity;
    }

    const tax = subtotal * 0.18; // 18% GST mock
    const grandTotal = subtotal + tax;

    // Create Invoice
    const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const invoice = new Invoice({
      invoiceNumber,
      amount: grandTotal,
      customerName: customer.name,
      customerPhone: customer.phone,
      employeeId,
      storeId,
      totalQuantity,
      subtotalAmount: subtotal,
      paymentStatus: 'Paid' // Assuming POS is paid immediately
    });

    await invoice.save();

    res.json({ success: true, message: 'Checkout successful', invoice });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Server error during checkout' });
  }
});

// GET dashboard target/sales for an employee today
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Calculate today's start and end dates
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const invoices = await Invoice.find({
      employeeId: userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const salesToday = invoices.reduce((acc, inv) => acc + inv.amount, 0);

    res.json({ success: true, salesToday, targetToday: 100000 }); // Mock target of 1 Lakh
  } catch (error) {
    console.error('Dashboard sales error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching sales' });
  }
});

// GET order history for a specific employee
router.get('/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const invoices = await Invoice.find({ employeeId: userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (error) {
    console.error('Order history error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching order history' });
  }
});

module.exports = router;
