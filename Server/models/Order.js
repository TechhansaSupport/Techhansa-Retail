const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  quotationReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', required: true },
  expectedDelivery: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'],
    default: 'Pending'
  },
  trackingInfo: {
    courier: { type: String },
    currentLocation: { type: String },
    progress: { type: Number, default: 0 } // 0 to 100 percentage
  },
  trackingId: { type: String },
  totalAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['Credit', 'NEFT', 'UPI', 'Advance Payment'], default: null },
  paymentStatus: { type: String, enum: ['Pending Verification', 'Reserved', 'Verified', 'Rejected', 'None'], default: 'None' },
  utrNumber: { type: String },
  transactionDate: { type: Date },
  receiptUrl: { type: String },
  userId: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
