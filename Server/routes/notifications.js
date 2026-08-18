const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Temporary simple auth check since we're keeping it aligned with admin
// Depending on auth implementation, we might want to just get 'admin' notifications
// For this simple implementation, we'll fetch notifications intended for 'admin'

// GET /api/notifications/:userId
// Fetch all notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PATCH /api/notifications/:userId/read-all
// Mark all notifications as read for a user
router.patch('/:userId/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.params.userId, unread: true }, { $set: { unread: false } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PATCH /api/notifications/:userId/:id/read
// Mark a specific notification as read
router.patch('/:userId/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.params.userId },
      { $set: { unread: false } },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/notifications/seed (Optional, just to add initial data)
router.post('/seed', async (req, res) => {
  try {
    await Notification.deleteMany({ userId: 'admin' });
    
    const initialData = [
      { userId: 'admin', title: 'New Franchise Request', message: 'User fran123 has registered.', time: '10 mins ago', unread: true },
      { userId: 'admin', title: 'System Update', message: 'Central database synced successfully.', time: '1 hour ago', unread: false },
    ];
    
    await Notification.insertMany(initialData);
    res.json({ success: true, message: 'Notifications seeded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
