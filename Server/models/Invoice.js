const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  orderReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false },
  amount: { type: Number, required: true },
  customerName: { type: String, required: false },
  customerPhone: { type: String, required: false },
  employeeId: { type: String, required: false },
  storeId: { type: String, required: false },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid', 'Overdue'],
    default: 'Unpaid'
  },
  userId: { type: String, required: false },
  totalQuantity: { type: Number, default: 0 },
  subtotalAmount: { type: Number, default: 0 },
  receivedAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  taxBreakdown: [{
    hsn: String,
    taxableValue: Number,
    cgstRate: Number,
    cgstAmount: Number,
    sgstRate: Number,
    sgstAmount: Number,
    totalTaxAmount: Number
  }],
  totalAmountInWords: String,
  bankDetails: {
    name: String,
    ifscCode: String,
    accountNo: String,
    bankName: String
  },
  termsAndConditions: [String]
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
