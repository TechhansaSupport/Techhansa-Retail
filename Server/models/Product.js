const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  storeId: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  specs: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  sellingPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
