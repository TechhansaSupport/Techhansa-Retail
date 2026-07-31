const mongoose = require('mongoose');

const channelDirectorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  incomeAmount: { type: String },
  incomeUnit: { type: String },
  aadhar: { type: String, required: true },
  pan: { type: String, required: true },
  address: { type: String }
});

const channelPartnerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  cinGst: { type: String },
  companyPan: { type: String },
  companyTan: { type: String },
  registeredAddress: { type: String, required: true },
  companyContact: { type: String, required: true },
  authName: { type: String, required: true },
  authContact: { type: String, required: true },
  authEmail: { type: String, required: true },
  documentPath: { type: String },
  directors: [channelDirectorSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChannelPartner', channelPartnerSchema);
