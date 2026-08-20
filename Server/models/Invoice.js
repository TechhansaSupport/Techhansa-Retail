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
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    brand: String,
    model: String,
    specs: String,
    quantity: Number,
    sellingPrice: Number,
    unitPrice: Number,
    hsn: String,
    taxRate: { type: Number, default: 18 },
    serialNumbers: [String]
  }],
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
  productDetails: [{
    productName: String,
    brand: String,
    model: String,
    configuration: String,
    serialNumber: String,
    rate: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 }
  }],
  buyerDetails: {
    buyerId: String,
    productId: String,
    buyerName: String,
    paymentDetails: { type: String, enum: ['Credit Limit', 'Advance Payment'], default: 'Advance Payment' }
  },
  termsAndConditions: [String]
}, { timestamps: true });
InvoiceSchema.pre('save', function () {
  if (this.paymentStatus === 'Paid') {
    this.receivedAmount = this.amount;
    this.balanceAmount = 0;
  } else {
    if (this.receivedAmount === undefined || this.receivedAmount === null) {
      this.receivedAmount = 0;
    }
    this.balanceAmount = Math.max(0, this.amount - this.receivedAmount);
  }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
