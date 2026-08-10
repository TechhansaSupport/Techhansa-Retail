const mongoose = require('mongoose');

const CompanySettingsSchema = new mongoose.Schema({
  companyName: { type: String, default: 'TECHHANSA Retail' },
  registeredAddress: { type: String, default: 'REGD. OFF-SHI 8/27A-K-3 GILAT BAZAR BYPASS\nSHIVPURKOT, VARANASI, UP-221002' },
  gstin: { type: String, default: '' },
  stateName: { type: String, default: '' },
  contactNumber: { type: String, default: '+91-7607650206 , 9711888951' },
  email: { type: String, default: 'finance@techhansa.com' },
  bankDetails: {
    accountHolderName: { type: String, default: 'TECHHANSA Retail' },
    bankName: { type: String, default: '' },
    accountNo: { type: String, default: '' },
    ifscCode: { type: String, default: '' }
  },
  declaration: { type: String, default: 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.' },
  authorizedSignatoryText: { type: String, default: 'Verified by & Authorised Signatory\nCompany Secretary' }
}, { timestamps: true });

module.exports = mongoose.model('CompanySettings', CompanySettingsSchema);
