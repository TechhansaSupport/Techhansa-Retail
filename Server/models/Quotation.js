const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
  quotationNo: { type: String, required: true, unique: true },
  rfpReference: { type: mongoose.Schema.Types.ObjectId, ref: 'RFP', required: false },
  procurementReference: { type: mongoose.Schema.Types.ObjectId, ref: 'ProcurementRequest', required: false },
  storeId: { type: String, required: false },
  vendor: { type: String, required: true },
  amount: { type: Number, required: true },
  validUntil: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Pending Verification', 'Paid'],
    default: 'Pending'
  },
  paymentMethod: { type: String },
  utrNumber: { type: String },
  transactionDate: { type: Date },
  items: [{
    productName: String,
    brand: String,
    model: String,
    configuration: String,
    quantity: Number,
    unitPrice: Number,
    totalAmount: Number
  }],
  userId: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Quotation', QuotationSchema);
