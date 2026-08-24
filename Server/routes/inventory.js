const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all inventory items for a specific store
router.get('/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const inventory = await Product.find({ storeId }).sort({ createdAt: -1 });
    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST seed inventory for testing
router.post('/seed', async (req, res) => {
  try {
    const storeId = req.body.storeId || 'STORE-001';
    
    // Clear existing for this store
    await Product.deleteMany({ storeId });

    const dummyProducts = [
      { storeId, serialNumber: 'SN1001', model: 'ThinkPad X1 Carbon Gen 11', name: 'Lenovo ThinkPad X1 Carbon Gen 11', brand: 'Lenovo', category: 'Laptops', specs: 'Intel i7, 16GB RAM, 512GB SSD', quantity: 5, availableStock: 5, sellingPrice: 125000, buyingPrice: 100000, mrp: 130000, lowStockAlert: 2 },
      { storeId, serialNumber: 'SN1002', model: 'MacBook Air M2', name: 'Apple MacBook Air M2', brand: 'Apple', category: 'Laptops', specs: 'M2 Chip, 8GB RAM, 256GB SSD', quantity: 12, availableStock: 12, sellingPrice: 115000, buyingPrice: 95000, mrp: 120000, lowStockAlert: 3 },
      { storeId, serialNumber: 'SN1003', model: 'Dell XPS 13 Plus', name: 'Dell XPS 13 Plus', brand: 'Dell', category: 'Laptops', specs: 'Intel i5, 16GB RAM, 1TB SSD', quantity: 3, availableStock: 3, sellingPrice: 140000, buyingPrice: 115000, mrp: 145000, lowStockAlert: 2 },
    ];

    await Product.insertMany(dummyProducts);
    res.json({ success: true, message: 'Inventory seeded successfully for store ' + storeId });
  } catch (error) {
    console.error('Error seeding inventory:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST add new inventory item — syncs quantity = availableStock
router.post('/:storeId', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.serialNumber === '' || payload.serialNumber === undefined) {
      delete payload.serialNumber;
    }

    // Keep quantity and availableStock in sync on creation
    const stock = Number(payload.availableStock) || 0;
    payload.quantity = stock;
    payload.availableStock = stock;
    payload.storeId = req.params.storeId;

    // Check if product already exists (by model and storeId) to prevent duplicates
    const existing = await Product.findOne({ storeId: payload.storeId, model: payload.model });
    if (existing) {
      existing.quantity += payload.quantity;
      existing.availableStock += payload.availableStock;
      if (payload.serialNumber) {
        existing.serialNumbers = existing.serialNumbers || [];
        if (!existing.serialNumbers.includes(payload.serialNumber)) {
          existing.serialNumbers.push(payload.serialNumber);
        }
      }
      await existing.save();
      return res.json({ success: true, data: existing });
    }

    const newProduct = new Product(payload);
    await newProduct.save();
    res.json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// PUT update inventory item — syncs quantity = availableStock
router.put('/:storeId/:id', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.serialNumber === '' || payload.serialNumber === undefined) {
      delete payload.serialNumber;
    }

    // Keep quantity and availableStock in sync when admin edits stock
    if (payload.availableStock !== undefined) {
      payload.quantity = Number(payload.availableStock);
    }
    // Remove fields that shouldn't be overwritten
    delete payload._id;
    delete payload.__v;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

module.exports = router;

