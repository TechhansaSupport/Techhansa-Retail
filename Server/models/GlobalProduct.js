const mongoose = require('mongoose');

const globalProductSchema = new mongoose.Schema({
  serialNumber: { type: String, required: false, sparse: true },
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

globalProductSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('GlobalProduct', globalProductSchema);
