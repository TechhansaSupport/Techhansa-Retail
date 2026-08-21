const express = require('express');
const router = express.Router();
const GlobalProduct = require('../models/GlobalProduct');
const { verifyAdminToken, requireRoles } = require('../middleware/auth');

const warehouseAuth = requireRoles(['admin', 'warehouse_manager']);

// GET all inventory
router.get('/inventory', warehouseAuth, async (req, res) => {
  try {
    const products = await GlobalProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching warehouse inventory:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST add new inventory items (with serial numbers)
router.post('/inventory/add', warehouseAuth, async (req, res) => {
  try {
    const { name, brand, category, model, specs, buyingPrice, mrp, sellingPrice, lowStockAlert, serialNumbers } = req.body;
    
    if (!serialNumbers || !Array.isArray(serialNumbers) || serialNumbers.length === 0) {
      return res.status(400).json({ error: 'At least one serial number is required' });
    }

    // Check if the exact SKU (model, specs) already exists
    let product = await GlobalProduct.findOne({ model, specs });

    if (product) {
      // Append new serial numbers (ensure uniqueness inside the array)
      const existingSerials = new Set(product.serialNumbers || []);
      for (const sn of serialNumbers) {
        existingSerials.add(sn);
      }
      product.serialNumbers = Array.from(existingSerials);
      product.quantity = product.serialNumbers.length;
      product.availableStock = product.quantity - (product.reservedStock || 0);
      
      // Update pricing if provided
      if (buyingPrice) product.buyingPrice = buyingPrice;
      if (mrp) product.mrp = mrp;
      if (sellingPrice) product.sellingPrice = sellingPrice;

      await product.save();
      return res.json({ message: 'Stock updated successfully', product });
    } else {
      // Create new SKU
      const quantity = serialNumbers.length;
      const newProduct = new GlobalProduct({
        name,
        brand,
        category,
        model,
        specs,
        buyingPrice,
        mrp,
        sellingPrice,
        lowStockAlert: lowStockAlert || 5,
        serialNumbers,
        quantity,
        availableStock: quantity,
        reservedStock: 0
      });
      await newProduct.save();
      return res.status(201).json({ message: 'Product created and stock added', product: newProduct });
    }
  } catch (error) {
    console.error('Error adding warehouse inventory:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
