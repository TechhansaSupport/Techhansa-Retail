const mongoose = require('mongoose');

const b2bInvoiceSchema = new mongoose.Schema({
  storeId: { type: String, required: true },
  invoiceNo: { type: String, required: true, unique: true },
  requestId: { type: String },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Payment Verification', 'Paid'], default: 'Pending' },
  invoiceFile: { type: String },
  paymentDetails: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('B2BInvoice', b2bInvoiceSchema);
