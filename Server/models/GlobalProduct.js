const mongoose = require('mongoose');

const globalProductSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  specs: { type: String, required: true },
  taxCode: { type: String, required: true },
  basePurchasePrice: { type: Number, required: true }, // Dynamic B2B base price
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

globalProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('GlobalProduct', globalProductSchema);
