const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
  quotationNo: { type: String, required: true, unique: true },
  rfpReference: { type: mongoose.Schema.Types.ObjectId, ref: 'RFP', required: true },
  vendor: { type: String, required: true },
  amount: { type: Number, required: true },
  validUntil: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
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
