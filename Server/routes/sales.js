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
      const updateQuery = {
        $inc: { quantity: -item.quantity, availableStock: -item.quantity }
      };
      
      if (item.serialNumbers && item.serialNumbers.length > 0) {
        updateQuery.$pullAll = { serialNumbers: item.serialNumbers };
      }

      const result = await Product.updateOne(
        { _id: item._id || item.id, availableStock: { $gte: item.quantity } },
        updateQuery
      );

      if (result.modifiedCount === 0) {
        // Rollback already deducted products
        for (const deducted of deductedProducts) {
          await Product.updateOne(
            { _id: deducted._id || deducted.id },
            { $inc: { quantity: deducted.quantity, availableStock: deducted.quantity } }
          );
        }
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.model} or product not found.` });
      }
      
      deductedProducts.push(item);
      subtotal += (item.sellingPrice * item.quantity);
      totalQuantity += item.quantity;
    }

    const invoiceItems = cart.map(item => ({
      productId: item._id || item.id,
      name: item.name,
      brand: item.brand,
      model: item.model,
      specs: item.specs,
      quantity: item.quantity,
      sellingPrice: item.sellingPrice,
      serialNumbers: item.serialNumbers || []
    }));
    const CompanySettings = require('../models/CompanySettings');
    let settings = await CompanySettings.findOne();
    
    let gstRate = settings && settings.globalGstPercentage !== undefined ? settings.globalGstPercentage : 18;
    if (customer && customer.gstPercentage !== undefined && customer.gstPercentage !== '') {
      gstRate = Number(customer.gstPercentage);
    }

    // Calculate inclusive GST: grandTotal is the original subtotal (inclusive amount)
    const grandTotal = subtotal;
    const tax = grandTotal * gstRate / (100 + gstRate);
    const baseSubtotal = grandTotal - tax;

    // Create Invoice with sequential number
    const year = new Date().getFullYear();
    const lastInvoice = await Invoice.findOne({ invoiceNumber: { $regex: `^INV-${year}-` } }).sort({ createdAt: -1 });
    let nextNum = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const parts = lastInvoice.invoiceNumber.split('-');
      if (parts.length === 3) {
        const lastNum = parseInt(parts[2], 10);
        if (!isNaN(lastNum)) {
          nextNum = lastNum + 1;
        }
      }
    }
    const invoiceNumber = `INV-${year}-${String(nextNum).padStart(3, '0')}`;

    const invoice = new Invoice({
      invoiceNumber,
      amount: grandTotal,
      customerName: customer.name,
      customerPhone: customer.phone,
      employeeId,
      storeId,
      totalQuantity,
      subtotalAmount: baseSubtotal,
      paymentStatus: 'Paid',
      items: invoiceItems
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
    const User = require('../models/User');

    const user = await User.findOne({ userId: userId });
    const targetToday = user?.dailyTarget || 100000;
    
    // Calculate today's start and end dates
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayInvoices = await Invoice.find({
      employeeId: userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const salesToday = todayInvoices.reduce((acc, inv) => acc + inv.amount, 0);
    const ordersProcessed = todayInvoices.length;
    const aov = ordersProcessed > 0 ? Math.round(salesToday / ordersProcessed) : 0;

    // Recent Bills
    const recentBillsData = await Invoice.find({ employeeId: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBills = recentBillsData.map(inv => {
      const diffInMinutes = Math.floor((new Date() - inv.createdAt) / 60000);
      let timeStr = '';
      if (diffInMinutes < 1) timeStr = `Just now`;
      else if (diffInMinutes < 60) timeStr = `${diffInMinutes} mins ago`;
      else if (diffInMinutes < 1440) timeStr = `${Math.floor(diffInMinutes / 60)} hours ago`;
      else timeStr = `${Math.floor(diffInMinutes / 1440)} days ago`;

      return {
        id: inv.invoiceNumber,
        time: timeStr,
        amount: inv.amount,
        items: inv.totalQuantity || (inv.items ? inv.items.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0)
      };
    });

    // Weekly Performance
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyInvoices = await Invoice.find({
      employeeId: userId,
      createdAt: { $gte: startOfWeek, $lte: endOfDay }
    }).populate('items.productId');

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const performanceHistoryMap = {};
    const orderedDays = [];
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      performanceHistoryMap[dayName] = 0;
      orderedDays.push(dayName);
    }

    const categoryCountMap = {};

    weeklyInvoices.forEach(inv => {
      const dayName = days[inv.createdAt.getDay()];
      if (performanceHistoryMap[dayName] !== undefined) {
        performanceHistoryMap[dayName] += inv.amount;
      }
      
      if (inv.items) {
        inv.items.forEach(item => {
          const cat = item.productId && item.productId.category ? item.productId.category : 'Others';
          categoryCountMap[cat] = (categoryCountMap[cat] || 0) + (item.quantity || 1);
        });
      }
    });

    const performanceHistory = orderedDays.map(day => ({
      day,
      sales: performanceHistoryMap[day],
      target: targetToday
    }));

    const totalCategories = Object.values(categoryCountMap).reduce((a, b) => a + b, 0);
    let categoryDistribution = [];
    if (totalCategories > 0) {
      categoryDistribution = Object.keys(categoryCountMap).map(cat => ({
        name: cat,
        value: Math.round((categoryCountMap[cat] / totalCategories) * 100)
      })).sort((a, b) => b.value - a.value).slice(0, 4);
    }

    res.json({ 
      success: true, 
      salesToday, 
      targetToday: targetToday,
      ordersProcessed,
      aov,
      recentBills,
      performanceHistory,
      categoryDistribution,
      totalWeeklyItems: totalCategories
    });
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

// GET all order history for a specific store
router.get('/store/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    // Populate employee name if possible, or just return as is
    const invoices = await Invoice.find({ storeId }).sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (error) {
    console.error('Store order history error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching store order history' });
  }
});

module.exports = router;
