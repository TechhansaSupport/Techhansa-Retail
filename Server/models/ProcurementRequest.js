const mongoose = require('mongoose');

const requestItemSchema = new mongoose.Schema({
  hardwareType: { type: String, required: true },
  otherType: { type: String, default: '' },
  brand: { type: String, required: true },
  quantity: { type: Number, required: true },
  specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  comments: { type: String, default: '' },
  price: { type: Number, default: 0 },
  amount: { type: Number, default: 0 }
}, { _id: false });

const procurementRequestSchema = new mongoose.Schema({
  storeId: { type: String, required: true },
  requestId: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  status: { type: String, required: true, enum: ['PENDING', 'APPROVED', 'DISPATCHED', 'DELIVERED', 'Quotation Sent', 'Paid', 'Processing', 'DECLINED'], default: 'PENDING' },
  items: [requestItemSchema],
  totalAmount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProcurementRequest', procurementRequestSchema);
