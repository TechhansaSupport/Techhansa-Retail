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
      { $group: {
          _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
          distributed: { $sum: "$totalCredit" },
          used: { $sum: "$usedCredit" }
        }
      }
    ]);

    const revenueDailyStats = await Invoice.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, paymentStatus: 'Paid' } },
      { $group: {
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
      { $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" }, role: "$role" },
          count: { $sum: 1 }
        }
      }
    ]);

    const invoiceStats = await Invoice.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: 'Paid' } },
      { $group: {
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
        $addFields: {
          orderNumber: '$requestId',
          userRole: 'franchise',
          userId: '$storeId',
          totalAmount: '$total',
          orderType: 'Franchise Procurement'
        }
      }
    ]);

    const mappedProcurements = procurements.map(pr => ({
      ...pr,
      paymentStatus: pr.status === 'PENDING' ? 'Pending Verification' : 'Verified',
      status: pr.status === 'PENDING' ? 'Pending' :
              pr.status === 'APPROVED' ? 'Processing' : 
              pr.status === 'DISPATCHED' ? 'Dispatched' :
              pr.status === 'DELIVERED' ? 'Delivered' : pr.status
    }));

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
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
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
    const request = await ProcurementRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Procurement Request not found' });
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
    request.status = 'APPROVED';
    await request.save();

    // Generate B2BInvoice
    const invoice = new B2BInvoice({
      storeId: request.storeId,
      invoiceNo: `INV-${Date.now()}`,
      requestId: request.requestId,
      amount: totalAmount,
      status: 'Pending'
    });
    await invoice.save();

    res.json({ message: 'Procurement Request approved and Invoice generated successfully', request, invoice });
  } catch (error) {
    console.error('Error approving procurement request:', error);
    res.status(500).json({ message: 'Server error' });
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

    // Log the transaction
    const diff = user.totalCredit - oldCredit;
    if (diff !== 0) {
      const transaction = new CreditTransaction({
        userId: user.userId,
        type: diff > 0 ? 'Assigned' : 'Decreased',
        amount: Math.abs(diff),
        referenceId: 'ADMIN_UPDATE',
        description: `Super Admin adjusted credit limit from ${oldCredit} to ${user.totalCredit}`
      });
      await transaction.save();
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
