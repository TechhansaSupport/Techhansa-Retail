const express = require('express');
const router = express.Router();
const CompanySettings = require('../models/CompanySettings');

// GET Company Settings
router.get('/company', async (req, res) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = new CompanySettings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching company settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT Update Company Settings
router.put('/company', async (req, res) => {
  try {
    let settings = await CompanySettings.findOne();
    if (settings) {
      settings = await CompanySettings.findOneAndUpdate({}, req.body, { new: true });
    } else {
      settings = new CompanySettings(req.body);
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error('Error updating company settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
