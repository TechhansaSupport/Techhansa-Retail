// Server/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/seed', async (req, res) => {
  try {
    // Clear out old test users to avoid duplicate key errors if this is run multiple times
    await User.deleteMany({ userId: { $in: ['admin123', 'franchise123', 'channel123'] } });

    const adminUser = new User({
      userId: 'admin123',
      password: 'password123',
      role: 'admin'
    });
    
    const franchiseUser = new User({
      userId: 'franchise123',
      password: 'password123',
      role: 'franchise'
    });

    const channelUser = new User({
      userId: 'channel123',
      password: 'password123',
      role: 'channel'
    });

    await adminUser.save();
    await franchiseUser.save();
    await channelUser.save();
    
    res.send('Test admin, franchise, and channel users created successfully!');
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

    // 2. Verify password (Compare plain text for now; use bcrypt in production)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid User ID or Password' });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // 4. Send token and role back to frontend
    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;