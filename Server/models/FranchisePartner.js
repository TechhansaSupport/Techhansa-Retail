const mongoose = require('mongoose');

const franchisePartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date },
  contactNumber: { type: String, required: true },
  panCard: { type: String },
  aadharCard: { type: String },
  permanentAddress: { type: String, required: true },
  occupation: { type: String },
  companyName: { type: String },
  designation: { type: String },
  experience: { type: String },
  message: { type: String },
  accountNumber: { type: String },
  ifscCode: { type: String },
  bankAddress: { type: String },
  bankName: { type: String },
  documentPath: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FranchisePartner', franchisePartnerSchema);
