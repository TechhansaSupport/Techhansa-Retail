const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  orderReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid', 'Overdue'],
    default: 'Unpaid'
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
