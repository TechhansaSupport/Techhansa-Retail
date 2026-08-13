const mongoose = require('mongoose');

const RFPProductSchema = new mongoose.Schema({
  category: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  configuration: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true, default: 'Nos' },
  remarks: { type: String }
});

const RFPSchema = new mongoose.Schema({
  rfpId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  requirementName: { type: String, required: true },
  expectedDeliveryDate: { type: Date, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  remarks: { type: String },
  products: [RFPProductSchema],
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Under Review', 'Quotation Received', 'Approved', 'Rejected'],
    default: 'Draft'
  },
  userId: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('RFP', RFPSchema);
