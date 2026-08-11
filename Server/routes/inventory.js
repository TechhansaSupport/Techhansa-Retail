const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all inventory items for a specific store
router.get('/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const inventory = await Product.find({ storeId });
    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST seed inventory for testing
router.post('/seed', async (req, res) => {
  try {
    const storeId = req.body.storeId || 'store-001';
    
    // Clear existing for this store
    await Product.deleteMany({ storeId });

    const dummyProducts = [
      { storeId, serialNumber: 'SN1001', model: 'ThinkPad X1 Carbon Gen 11', specs: 'Intel i7, 16GB RAM, 512GB SSD', quantity: 5, sellingPrice: 125000 },
      { storeId, serialNumber: 'SN1002', model: 'MacBook Air M2', specs: 'M2 Chip, 8GB RAM, 256GB SSD', quantity: 12, sellingPrice: 115000 },
      { storeId, serialNumber: 'SN1003', model: 'Dell XPS 13 Plus', specs: 'Intel i5, 16GB RAM, 1TB SSD', quantity: 3, sellingPrice: 140000 },
      { storeId, serialNumber: 'SN1004', model: 'HP Spectre x360', specs: 'Intel i7, 16GB RAM, 512GB SSD', quantity: 8, sellingPrice: 130000 },
      { storeId, serialNumber: 'SN1005', model: 'Asus ROG Zephyrus G14', specs: 'Ryzen 9, 32GB RAM, 1TB SSD, RTX 4060', quantity: 0, sellingPrice: 165000 },
    ];

    await Product.insertMany(dummyProducts);
    res.json({ success: true, message: 'Inventory seeded successfully for store ' + storeId });
  } catch (error) {
    console.error('Error seeding inventory:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
