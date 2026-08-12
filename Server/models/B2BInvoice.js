const mongoose = require('mongoose');

const b2bInvoiceSchema = new mongoose.Schema({
  storeId: { type: String, required: true },
  invoiceNo: { type: String, required: true, unique: true },
  requestId: { type: String },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  invoiceFile: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('B2BInvoice', b2bInvoiceSchema);
