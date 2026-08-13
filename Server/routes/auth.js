// Server/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/seed', async (req, res) => {
  try {
    // Clear out old test users to avoid duplicate key errors if this is run multiple times
    await User.deleteMany({ userId: { $in: ['admin123', 'franchise123', 'employee123', 'channel123'] } });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = new User({
      userId: 'admin123',
      password: hashedPassword,
      role: 'admin'
    });
    
    const franchiseUser = new User({
      userId: 'franchise123',
      password: hashedPassword,
      role: 'franchise',
      storeId: 'store-001'
    });

    const employeeUser = new User({
      userId: 'employee123',
      password: hashedPassword,
      role: 'employee',
      storeId: 'store-001'
    });

    const channelUser = new User({
      userId: 'channel123',
      password: hashedPassword,
      role: 'channel'
    });

    await adminUser.save();
    await franchiseUser.save();
    await employeeUser.save();
    await channelUser.save();
    
    res.send('Test admin, franchise, employee, and channel users created successfully!');
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).send('Error seeding database: ' + error.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;

    // 1. Find user in the database
    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid User ID or Password' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ message: 'Account Suspended: Please contact the Super Admin.' });
    }

    // 2. Verify password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid User ID or Password' });
    }

    // 3. Handle specific role logic
    if (user.role === 'franchise') {
      user.isStoreActive = true;
      await user.save();
    } else if (user.role === 'employee') {
      const franchiseAdmin = await User.findOne({ role: 'franchise', storeId: user.storeId });
      if (!franchiseAdmin || !franchiseAdmin.isStoreActive) {
        return res.status(403).json({ message: 'Store is closed' });
      }
    }

    // 4. Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // 5. Send token and role back to frontend
    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        role: user.role,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        phone: user.phone,
        address: user.address,
        profilePhoto: user.profilePhoto,
        storeId: user.storeId,
        totalCredit: user.totalCredit || 0,
        usedCredit: user.usedCredit || 0,
        reservedCredit: user.reservedCredit || 0
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findOne({ userId });
    if (user && user.role === 'franchise') {
      user.isStoreActive = false;
      await user.save();
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

router.get('/me', async (req, res) => {
  try {
    // Usually uses JWT, but since frontend just passes userId in this simple auth:
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({
      userId: user.userId,
      role: user.role,
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      phone: user.phone,
      address: user.address,
      profilePhoto: user.profilePhoto,
      storeId: user.storeId,
      totalCredit: user.totalCredit || 0,
      usedCredit: user.usedCredit || 0,
      reservedCredit: user.reservedCredit || 0
    });
  } catch (error) {
    console.error('Fetch me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const { userId, name, email, companyName, phone, address, profilePhoto } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { name, email, companyName, phone, address, profilePhoto },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        userId: updatedUser.userId,
        role: updatedUser.role,
        name: updatedUser.name,
        email: updatedUser.email,
        companyName: updatedUser.companyName,
        phone: updatedUser.phone,
        address: updatedUser.address,
        profilePhoto: updatedUser.profilePhoto
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

module.exports = router;