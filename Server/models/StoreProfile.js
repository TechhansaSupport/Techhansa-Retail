const mongoose = require('mongoose');

const storeProfileSchema = new mongoose.Schema({
  storeId: { type: String, required: true, unique: true },
  storeName: { type: String, required: true },
  address: { type: String },
  manager: { type: String },
  employees: { type: Number, default: 0 },
  timings: { type: String },
  gst: { type: String },
  contact: { type: String },
  email: { type: String },
  totalCredit: { type: Number, default: 0 },
  usedCredit: { type: Number, default: 0 },
  reservedCredit: { type: Number, default: 0 },
  todaysSales: { type: Number, default: 0 },
  monthlySales: { type: Number, default: 0 },
  completedOrders: { type: Number, default: 0 },
  pendingOrders: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('StoreProfile', storeProfileSchema);
