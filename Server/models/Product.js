const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  storeId: { type: String, required: true },
  serialNumber: { type: String, required: false, unique: true, sparse: true },
  serialNumbers: [{ type: String }],

  name: { type: String, required: true },
  brand: { type: String, required: false },
  category: { type: String, required: false },
  model: { type: String, required: true },
  specs: { type: String, required: false },
  quantity: { type: Number, required: true, default: 0 },
  availableStock: { type: Number, required: true, default: 0 },
  lowStockAlert: { type: Number, required: false, default: 5 },
  reservedStock: { type: Number, required: false, default: 0 },
  buyingPrice: { type: Number, required: false },
  mrp: { type: Number, required: false },
  sellingPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
