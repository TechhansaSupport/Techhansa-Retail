const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  quotationReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', required: true },
  expectedDelivery: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  trackingInfo: {
    courier: { type: String },
    currentLocation: { type: String },
    progress: { type: Number, default: 0 } // 0 to 100 percentage
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
