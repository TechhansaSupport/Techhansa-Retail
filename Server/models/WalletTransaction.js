const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  storeId: { type: String, required: true },
  txnId: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Success' },
  closingBalance: { type: Number, required: true },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
