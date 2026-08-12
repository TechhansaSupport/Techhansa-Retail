// Server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Note: In production, always hash passwords using bcrypt
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'franchise', 'channel', 'employee'] 
  },
  storeId: { 
    type: String, 
    required: function() { 
      return this.role === 'franchise' || this.role === 'employee'; 
    } 
  },
  isStoreActive: { 
    type: Boolean, 
    default: false 
  },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  companyName: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  totalCredit: { type: Number, default: 0 },
  usedCredit: { type: Number, default: 0 },
  reservedCredit: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);