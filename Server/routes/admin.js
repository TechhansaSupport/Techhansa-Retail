// Server/routes/admin.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const GlobalProduct = require('../models/GlobalProduct');
const Invoice = require('../models/Invoice');
const CreditTransaction = require('../models/CreditTransaction');
const FranchisePartner = require('../models/FranchisePartner');
const ChannelPartner = require('../models/ChannelPartner');
const Order = require('../models/Order');
const ProcurementRequest = require('../models/ProcurementRequest');
const B2BInvoice = require('../models/B2BInvoice');
const StoreProfile = require('../models/StoreProfile');
const Quotation = require('../models/Quotation');
const RFP = require('../models/RFP');
// Middleware to check if user is admin (Assuming basic auth or we check token in a real scenario)
// For simplicity and matching current setup, we might rely on the frontend to protect routes,
// but it's good practice to add a middleware if we were passing tokens.
const { verifyAdminToken } = require('../middleware/auth');

// Apply admin verification middleware to ALL routes in this router
router.use(verifyAdminToken);

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $in: ['franchise', 'channel'] } });

    const userCreditStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalCreditDistributed: { $sum: "$totalCredit" },
          totalUsedCredit: { $sum: "$usedCredit" }
        }
      }
    ]);
    const totalCreditDistributed = userCreditStats[0]?.totalCreditDistributed || 0;
    const totalUsedCredit = userCreditStats[0]?.totalUsedCredit || 0;

    const productStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalInventoryItems: { $sum: "$quantity" },
          totalInventoryValue: { $sum: { $multiply: ["$quantity", "$sellingPrice"] } }
        }
      }
    ]);
    const totalInventoryItems = productStats[0]?.totalInventoryItems || 0;
    const totalInventoryValue = productStats[0]?.totalInventoryValue || 0;

    const invoiceStats = await Invoice.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);
    const totalRevenue = invoiceStats[0]?.totalRevenue || 0;

    // Generate real 7-day trailing data for sparklines
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const userDailyStats = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, role: { $in: ['franchise', 'channel'] } } },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
          distributed: { $sum: "$totalCredit" },
          used: { $sum: "$usedCredit" }
        }
      }
    ]);

    const revenueDailyStats = await Invoice.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, paymentStatus: 'Paid' } },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$amount" }
        }
      }
    ]);

    const userSparkline = [];
    const distributedCreditSparkline = [];
    const usedCreditSparkline = [];
    const revenueSparkline = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();

      const userStat = userDailyStats.find(s => s._id.day === day && s._id.month === month && s._id.year === year);
      userSparkline.push({ v: userStat ? userStat.count : 0 });
      distributedCreditSparkline.push({ v: userStat ? userStat.distributed : 0 });
      usedCreditSparkline.push({ v: userStat ? userStat.used : 0 });

      const revenueStat = revenueDailyStats.find(s => s._id.day === day && s._id.month === month && s._id.year === year);
      revenueSparkline.push({ v: revenueStat ? revenueStat.revenue : 0 });
    }

    res.json({
      totalUsers,
      totalCreditDistributed,
      totalUsedCredit,
      totalInventoryItems,
      totalInventoryValue,
      totalRevenue,
      userSparkline,
      distributedCreditSparkline,
      usedCreditSparkline,
      revenueSparkline
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/dashboard/chart
router.get('/dashboard/chart', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const userStats = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, role: { $in: ['franchise', 'channel'] } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" }, role: "$role" },
          count: { $sum: 1 }
        }
      }
    ]);

    const invoiceStats = await Invoice.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: 'Paid' } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.getMonth() + 1; // 1-12
      const year = d.getFullYear();
      const name = monthNames[d.getMonth()];

      chartData.push({
        name,
        month,
        year,
        Franchise: 0,
        B2B: 0,
        Revenue: 0
      });
    }

    userStats.forEach(stat => {
      const dataRow = chartData.find(d => d.month === stat._id.month && d.year === stat._id.year);
      if (dataRow) {
        if (stat._id.role === 'franchise') dataRow.Franchise += stat.count;
        if (stat._id.role === 'channel') dataRow.B2B += stat.count;
      }
    });

    invoiceStats.forEach(stat => {
      const dataRow = chartData.find(d => d.month === stat._id.month && d.year === stat._id.year);
      if (dataRow) {
        dataRow.Revenue += stat.totalRevenue;
      }
    });

    res.json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $lookup: { from: 'users', localField: 'userId', foreignField: 'userId', as: 'userDetails' } },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      { $addFields: { userRole: '$userDetails.role', orderType: 'Enterprise' } },
      { $project: { userDetails: 0 } }
    ]);

    const procurements = await ProcurementRequest.aggregate([
      {
        $lookup: {
          from: 'quotations',
          localField: '_id',
          foreignField: 'procurementReference',
          as: 'quotations'
        }
      },
      {
        $addFields: {
          orderNumber: '$requestId',
          userRole: 'franchise',
          userId: '$storeId',
          totalAmount: '$total',
          orderType: 'Franchise Procurement',
          quotationPaymentStatus: { $arrayElemAt: ['$quotations.paymentStatus', 0] }
        }
      },
      {
        $project: { quotations: 0 }
      }
    ]);

    const mappedProcurements = procurements.map(pr => {
      let paymentStatus = pr.status === 'PENDING' ? 'Pending' : (pr.status === 'PAYMENT_VERIFICATION' ? 'Pending Verification' : 'Verified');
      if (pr.status === 'PAYMENT_REJECTED' || (pr.status === 'PENDING' && pr.quotationPaymentStatus === 'Rejected')) {
        paymentStatus = 'Rejected';
      }
      return {
        ...pr,
        paymentStatus,
        status: pr.status === 'PENDING' ? 'Pending' :
          pr.status === 'PAYMENT_REJECTED' ? 'Declined' :
          pr.status === 'PAYMENT_VERIFICATION' ? 'Payment Verification' :
          pr.status === 'APPROVED' ? 'Processing' :
              pr.status === 'DISPATCHED' ? 'Dispatched' :
                pr.status === 'DELIVERED' ? 'Delivered' : pr.status
      };
    });

    const allOrders = [...orders, ...mappedProcurements].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(allOrders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status, amount } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('quotationReference');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.quotationReference) {
      if (status === 'Quotation Sent' || status === 'Confirmed') {
        await Quotation.findByIdAndUpdate(order.quotationReference._id, { 
          status: 'Approved',
          amount: amount || order.totalAmount || 0,
          paymentStatus: 'Pending'
        });
        if (order.quotationReference.rfpReference) {
          await RFP.findByIdAndUpdate(order.quotationReference.rfpReference, { 
            status: status === 'Quotation Sent' ? 'Quotation Received' : 'Approved' 
          });
        }
      } else if (status === 'Declined') {
        await Quotation.findByIdAndUpdate(order.quotationReference._id, { status: 'Rejected' });
        if (order.quotationReference.rfpReference) {
          await RFP.findByIdAndUpdate(order.quotationReference.rfpReference, { status: 'Rejected' });
        }
      }
    }

    // Deduct inventory when dispatched
    if (status === 'Dispatched') {
      let itemsToDeduct = order.items && order.items.length > 0 ? order.items : [];
      if (itemsToDeduct.length === 0 && order.quotationReference && order.quotationReference.items) {
         itemsToDeduct = order.quotationReference.items;
      }
      
      for (const item of itemsToDeduct) {
        if (!item.brand || (!item.model && !item.productName)) continue;
        
        let product;
        if (item.model) {
          product = await GlobalProduct.findOne({ brand: item.brand, model: item.model });
        }
        if (!product && item.productName) {
          product = await GlobalProduct.findOne({ name: item.productName });
        }
        
        if (product) {
          product.quantity = Math.max(0, product.quantity - item.quantity);
          product.availableStock = Math.max(0, product.availableStock - item.quantity);
          await product.save();
        }
      }
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/orders/:id
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'quotationReference',
        populate: {
          path: 'rfpReference'
        }
      });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/procurement-requests/:id
router.get('/procurement-requests/:id', async (req, res) => {
  try {
    const request = await ProcurementRequest.findById(req.params.id).lean();
    if (!request) return res.status(404).json({ message: 'Procurement Request not found' });

    // Map fields for frontend modal
    request.totalAmount = request.total;

    // Format status nicely for UI
    if (request.status === 'PAYMENT_VERIFICATION') {
      request.status = 'Payment Verification';
    } else if (request.status === 'PENDING') {
      request.status = 'Pending';
    } else if (request.status === 'APPROVED') {
      request.status = 'Processing';
    } else if (request.status === 'DISPATCHED') {
      request.status = 'Dispatched';
    } else if (request.status === 'DELIVERED') {
      request.status = 'Delivered';
    }

    // Fetch related quotation or invoice for payment details
    const quotation = await require('../models/Quotation').findOne({ procurementReference: request._id });
    if (quotation) {
      request.invoiceNo = quotation.quotationNo;
      request.paymentMethod = quotation.paymentMethod;
      request.paymentStatus = quotation.paymentStatus;
      request.utr = quotation.utrNumber;
      request.receipt = quotation.receiptUrl; // Assuming this exists or is saved
    } else {
      const invoice = await B2BInvoice.findOne({ requestId: request.requestId });
      if (invoice) {
        request.invoiceNo = invoice.invoiceNo;
        if (invoice.paymentDetails) {
          request.paymentMethod = invoice.paymentDetails.method;
          request.paymentStatus = invoice.status;
          request.utr = invoice.paymentDetails.utr;
          request.receipt = invoice.paymentDetails.receipt;
        }
      }
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching procurement request details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/procurement-requests/:id/approve
router.post('/procurement-requests/:id/approve', async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const request = await ProcurementRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Procurement Request not found' });
    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only PENDING requests can be approved and invoiced.' });
    }

    // Update Procurement Request
    request.total = totalAmount;
    request.status = 'Quotation Sent';
    await request.save();

    // Generate Quotation instead of B2BInvoice
    const quotation = new Quotation({
      quotationNo: `QT-PR-${Date.now()}`,
      procurementReference: request._id,
      storeId: request.storeId,
      vendor: 'Techhansa Retail',
      amount: totalAmount,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'Pending',
      paymentStatus: 'Pending',
      items: request.items.map(item => ({
        productName: item.hardwareType === 'Others' ? item.otherType : item.hardwareType,
        brand: item.brand,
        model: item.model,
        configuration: JSON.stringify(item.specs),
        quantity: item.quantity,
        unitPrice: 0,
        totalAmount: 0
      })),
      userId: request.storeId
    });
    await quotation.save();

    res.json({ message: 'Quotation sent successfully', request, quotation });
  } catch (error) {
    console.error('Error approving procurement request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/procurement-requests/:id/confirm-payment
router.post('/procurement-requests/:id/confirm-payment', async (req, res) => {
  try {
    const request = await ProcurementRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Procurement Request not found' });
    if (request.status !== 'PAYMENT_VERIFICATION') {
      return res.status(400).json({ message: 'Only PAYMENT_VERIFICATION requests can have payments confirmed.' });
    }

    const quotation = await require('../models/Quotation').findOne({ procurementReference: request._id });
    const invoice = await B2BInvoice.findOne({ requestId: request.requestId });
    
    if (!quotation && !invoice) return res.status(404).json({ message: 'Quotation or B2B Invoice not found' });

    // Update statuses
    request.status = 'DISPATCHED';
    await request.save();

    if (quotation) {
      quotation.paymentStatus = 'Paid';
      await quotation.save();
    }
    if (invoice) {
      invoice.status = 'Paid';
      await invoice.save();
    }

    res.json({ success: true, invoice, request });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// PATCH /api/admin/procurement-requests/:id/status
router.patch('/procurement-requests/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ProcurementRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: 'Procurement request not found' });
    }

    // Deduct inventory when dispatched
    if (status === 'DISPATCHED') {
      for (const item of request.items) {
        if (!item.hardwareType) continue;
        // Franchise requests use hardwareType/otherType as name, and brand as brand.
        const productName = item.hardwareType === 'Others' ? item.otherType : item.hardwareType;
        
        let product;
        if (item.model) {
          product = await GlobalProduct.findOne({ brand: item.brand, model: item.model });
        }
        if (!product && item.specs && item.specs.model) {
          product = await GlobalProduct.findOne({ brand: item.brand, model: item.specs.model });
        }
        if (!product) {
          // Fallback to searching by brand and category/name
          product = await GlobalProduct.findOne({ brand: item.brand, category: item.hardwareType });
        }
        
        if (product) {
          product.quantity = Math.max(0, product.quantity - item.quantity);
          product.availableStock = Math.max(0, product.availableStock - item.quantity);
          await product.save();
        }
      }
    }

    res.json(request);
  } catch (error) {
    console.error('Error updating procurement request status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/rfps/:id/approve
router.post('/rfps/:id/approve', async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount === undefined || amount < 0) {
      return res.status(400).json({ message: 'Valid amount is required.' });
    }

    const rfp = await RFP.findById(req.params.id);
    if (!rfp) return res.status(404).json({ message: 'RFP not found' });

    // Find the associated Quotation
    const quotation = await Quotation.findOne({ rfpReference: rfp._id });
    if (!quotation) {
      return res.status(404).json({ message: 'Associated Quotation not found for this RFP' });
    }

    // Update RFP status
    rfp.status = 'Quotation Received';
    await rfp.save();

    // Update Quotation amount and set status to 'Approved', paymentStatus to 'Pending'
    quotation.amount = amount;
    quotation.status = 'Approved';
    quotation.paymentStatus = 'Pending';
    await quotation.save();

    // Also find the associated Order and update its status
    const order = await Order.findOne({ quotationReference: quotation._id });
    if (order) {
      order.status = 'Quotation Sent';
      order.totalAmount = amount;
      await order.save();
    }

    res.json({ message: 'Quotation sent successfully', rfp, quotation });
  } catch (error) {
    console.error('Error approving RFP:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/orders/:id/invoice
router.post('/orders/:id/invoice', async (req, res) => {
  try {
    const orderId = req.params.id;
    // We need to support both Order and ProcurementRequest
    let invoiceData = null;
    let orderUpdate = null;

    // Check if it's already a B2BInvoice (Franchise B2B Invoice from Dashboard)
    const existingB2B = await B2BInvoice.findById(orderId);
    if (existingB2B) {
      existingB2B.invoiceSent = true;
      await existingB2B.save();
      return res.json({ message: 'Invoice sent successfully', invoice: existingB2B });
    }

    // Check if it's an Order (Channel)
    const order = await Order.findById(orderId).populate('quotationReference');
    if (order) {
      if (order.status !== 'Paid' && order.paymentStatus !== 'Paid') {
        return res.status(400).json({ message: 'Only Paid orders can be invoiced.' });
      }
      
      const invoice = new Invoice({
        invoiceNumber: `INV-${Date.now()}`,
        userId: order.userId,
        orderReference: order._id,
        amount: order.totalAmount,
        paymentStatus: 'Paid',
        paymentMethod: order.paymentMethod || 'Credit',
        items: order.items || (order.quotationReference ? order.quotationReference.items : [])
      });
      await invoice.save();

      order.status = 'Processing'; // Move forward
      await order.save();

      // Ensure RFP is also 'Approved' or something similar
      if (order.quotationReference && order.quotationReference.rfpReference) {
        const rfp = await RFP.findById(order.quotationReference.rfpReference);
        if (rfp) {
          rfp.status = 'Approved';
          await rfp.save();
        }
      }

      invoiceData = invoice;
      orderUpdate = order;
    } else {
      // Check if it's a ProcurementRequest (Franchise)
      const pr = await ProcurementRequest.findById(orderId);
      if (pr) {
        if (pr.status !== 'Paid') {
          return res.status(400).json({ message: 'Only Paid requests can be invoiced.' });
        }

        const b2bInvoice = new B2BInvoice({
          storeId: pr.storeId,
          invoiceNo: `INV-${Date.now()}`,
          requestId: pr.requestId,
          amount: pr.total,
          status: 'Paid',
          invoiceFile: `/invoices/${pr.requestId}-invoice.pdf`
        });
        await b2bInvoice.save();

        pr.status = 'Processing';
        await pr.save();

        invoiceData = b2bInvoice;
        orderUpdate = pr;
      } else {
        return res.status(404).json({ message: 'Order/Request not found' });
      }
    }

    res.json({ message: 'Invoice generated and sent successfully', invoice: invoiceData, order: orderUpdate });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// GET /api/admin/entities
router.get('/entities', async (req, res) => {
  try {
    const entities = await User.find({
      role: { $in: ['franchise', 'channel'] },
      deletedAt: null
    }).select('-password');
    res.json(entities);
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/entities
router.post('/entities', async (req, res) => {
  try {
    const { userId, password, role, email, name, storeId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userId,
      password: hashedPassword,
      role,
      email,
      name,
      storeId: role === 'franchise' ? storeId : undefined
    });

    await newUser.save();

    // Create StoreProfile if role is franchise
    if (role === 'franchise' && storeId) {
      const StoreProfile = require('../models/StoreProfile');
      // Check if one already exists just in case
      const existingProfile = await StoreProfile.findOne({ storeId });
      if (!existingProfile) {
        await StoreProfile.create({
          storeId,
          storeName: `${name} Store`,
          manager: name,
          email,
          contact: '',
          address: '',
          walletBalance: 0,
        });
      }
    }

    // Don't send the password back
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating entity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/entities/:userId
router.put('/entities/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, storeId, role, status } = req.body;
    // Only include fields that are explicitly provided in req.body
    let updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (storeId !== undefined) updateData.storeId = storeId;
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;

    // Optional: update password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating entity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/entities/:userId
router.delete('/entities/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Soft delete by setting deletedAt
    const deletedUser = await User.findOneAndUpdate(
      { userId },
      { deletedAt: new Date(), status: 'Suspended' },
      { new: true }
    );

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', userId });
  } catch (error) {
    console.error('Error deleting entity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/entities/:userId/credit
router.put('/entities/:userId/credit', async (req, res) => {
  try {
    const { userId } = req.params;
    const { totalCredit } = req.body;

    if (totalCredit === undefined || totalCredit < 0) {
      return res.status(400).json({ message: 'Invalid credit amount' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldCredit = user.totalCredit || 0;
    user.totalCredit = Number(totalCredit);
    await user.save();

    // Sync the totalCredit to StoreProfile if the user has stores
    if (user.role === 'franchise' && user.storeId) {
      const storeIds = user.storeId.split(',').map(s => s.trim());
      await StoreProfile.updateMany(
        { storeId: { $in: storeIds } },
        { $set: { totalCredit: Number(totalCredit) } }
      );
    }

    // Log the credit transaction
    const diff = user.totalCredit - oldCredit;
    if (diff !== 0) {
      const transaction = new CreditTransaction({
        userId: user.userId,
        type: diff > 0 ? 'Assigned' : 'Decreased',
        amount: Math.abs(diff),
        referenceId: 'ADMIN_UPDATE',
        description: diff > 0 
          ? `Credit assingned by super admin  ${oldCredit} to ${user.totalCredit}`
          : `Credit removed by admin from ${oldCredit} to ${user.totalCredit}`
      });
      await transaction.save();

      // Also create a WalletTransaction for franchise stores so it shows in the Store Admin wallet ledger
      if (user.role === 'franchise' && user.storeId) {
        const WalletTransaction = require('../models/WalletTransaction');
        const storeIds = user.storeId.split(',').map(s => s.trim());
        const newBalance = (user.totalCredit || 0) - (user.usedCredit || 0);
        for (const sid of storeIds) {
          const walletTxn = new WalletTransaction({
            storeId: sid,
            txnId: `CRD-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            date: new Date(),
            type: diff > 0 ? 'Credit In' : 'Credit Out',
            amount: Math.abs(diff),
            status: 'Success',
            closingBalance: newBalance,
            description: diff > 0
              ? `Credit limit increased by ₹${Math.abs(diff).toLocaleString('en-IN')} (Admin)`
              : `Credit limit decreased by ₹${Math.abs(diff).toLocaleString('en-IN')} (Admin)`
          });
          await walletTxn.save();
        }
      }
    }

    // Exclude password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error('Error assigning credit:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/entities/:userId/credit-history
router.get('/entities/:userId/credit-history', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await CreditTransaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching credit history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/entities/:userId/status
router.put('/entities/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findOneAndUpdate(
      { userId },
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If suspended, also invalidate store
    if (status === 'Suspended' && user.role === 'franchise') {
      user.isStoreActive = false;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating entity status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/catalog
router.get('/catalog', async (req, res) => {
  try {
    const catalog = await GlobalProduct.find();
    res.json(catalog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/catalog
router.post('/catalog', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.serialNumber === '' || payload.serialNumber === undefined) {
      delete payload.serialNumber;
    }
    const stock = Number(payload.availableStock) || 0;
    payload.quantity = stock;
    payload.availableStock = stock;
    const product = new GlobalProduct(payload);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product', error);
    res.status(400).json({ message: 'Error creating product', error });
  }
});

// PUT /api/admin/catalog/:id
router.put('/catalog/:id', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.serialNumber === '' || payload.serialNumber === undefined) {
      delete payload.serialNumber;
    }
    // sync stock
    if (payload.availableStock !== undefined) {
      payload.quantity = Number(payload.availableStock) || 0;
    }
    const product = await GlobalProduct.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error updating product', error);
    res.status(400).json({ message: 'Error updating product', error });
  }
});

// DELETE /api/admin/catalog/:id
router.delete('/catalog/:id', async (req, res) => {
  try {
    const product = await GlobalProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error });
  }
});

// GET /api/admin/audit
router.get('/audit', async (req, res) => {
  try {
    const creditTransactions = await CreditTransaction.find().sort({ createdAt: -1 }).limit(100);
    const invoices = await Invoice.find().sort({ createdAt: -1 }).limit(100);

    res.json({
      creditTransactions,
      invoices
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
