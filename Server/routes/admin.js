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

    res.json({
      totalUsers,
      totalCreditDistributed,
      totalUsedCredit,
      totalInventoryItems,
      totalInventoryValue,
      totalRevenue
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
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
    const product = new GlobalProduct(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
});

// PUT /api/admin/catalog/:id
router.put('/catalog/:id', async (req, res) => {
  try {
    const product = await GlobalProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
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
