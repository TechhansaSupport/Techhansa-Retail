const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Temporary simple auth check since we're keeping it aligned with admin
// Depending on auth implementation, we might want to just get 'admin' notifications
// For this simple implementation, we'll fetch notifications intended for 'admin'

// GET /api/notifications
// Fetch all notifications
router.get('/', async (req, res) => {
  try {
    // Usually you'd filter by req.user.userId, but for admin portal we can just use 'admin'
    const notifications = await Notification.find({ userId: 'admin' }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PATCH /api/notifications/read-all
// Mark all notifications as read
router.patch('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ userId: 'admin', unread: true }, { $set: { unread: false } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PATCH /api/notifications/:id/read
// Mark a specific notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: 'admin' },
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
