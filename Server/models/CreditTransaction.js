const mongoose = require('mongoose');

const CreditTransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // The channel partner's userId
  type: { 
    type: String, 
    enum: ['Assigned', 'Increased', 'Decreased', 'Reserved', 'Released', 'Deducted', 'Refunded'],
    required: true 
  },
  amount: { type: Number, required: true },
  referenceId: { type: String }, // e.g., Order Number or Admin ID
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CreditTransaction', CreditTransactionSchema);
