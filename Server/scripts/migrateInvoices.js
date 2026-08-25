const mongoose = require('mongoose');
const Invoice = require('./models/Invoice');
const CompanySettings = require('./models/CompanySettings');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techhansa')
.then(async () => {
  console.log('Connected to MongoDB.');
  
  const invoices = await Invoice.find({ invoiceNumber: { $regex: '^INV-RFP|^THS-DL' } }).sort({ createdAt: 1 });
  
  for (const invoice of invoices) {
    let stateCode = 'DL';
    const settings = await CompanySettings.findOne();
    if (settings) {
      const addr = (settings.stateName || settings.registeredAddress || '').toUpperCase();
      if (addr.includes('UTTAR PRADESH') || addr.includes(' UP') || addr.includes('U.P') || addr.includes(', UP')) stateCode = 'UP';
      else if (addr.includes('MADHYA PRADESH') || addr.includes(' MP') || addr.includes('M.P')) stateCode = 'MP';
      else if (addr.includes('RAJASTHAN') || addr.includes(' RJ') || addr.includes('R.J')) stateCode = 'RJ';
      else if (addr.includes('MAHARASHTRA') || addr.includes(' MH') || addr.includes('M.H')) stateCode = 'MH';
      else if (addr.includes('GUJARAT') || addr.includes(' GJ') || addr.includes('G.J')) stateCode = 'GJ';
      else if (addr.includes('HARYANA') || addr.includes(' HR') || addr.includes('H.R')) stateCode = 'HR';
      else if (addr.includes('KARNATAKA') || addr.includes(' KA') || addr.includes('K.A')) stateCode = 'KA';
      else if (addr.includes('DELHI') || addr.includes(' DL') || addr.includes('D.L')) stateCode = 'DL';
    }

    const date = new Date(invoice.createdAt || Date.now());
    const month = date.getMonth();
    const year = date.getFullYear();
    let startYear, endYear;
    if (month >= 3) {
      startYear = year.toString().slice(-2);
      endYear = (year + 1).toString().slice(-2);
    } else {
      startYear = (year - 1).toString().slice(-2);
      endYear = year.toString().slice(-2);
    }
    const fy = `${startYear}-${endYear}`;

    const prefix = `THS-${stateCode}-${fy}`;
    
    // Find last seq
    const lastInvoice = await Invoice.findOne({ invoiceNumber: new RegExp(`^${prefix}-`) }).sort({ invoiceNumber: -1 });
    let seq = 1;
    if (lastInvoice && lastInvoice.invoiceNumber.startsWith(prefix)) {
      const parts = lastInvoice.invoiceNumber.split('-');
      const lastSeq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastSeq)) seq = lastSeq + 1;
    }
    
    const seqStr = seq.toString().padStart(3, '0');
    const newInvoiceNumber = `${prefix}-${seqStr}`;
    
    invoice.invoiceNumber = newInvoiceNumber;
    await invoice.save();
    console.log(`Updated invoice ID ${invoice._id} to ${newInvoiceNumber}`);
  }
  
  console.log('Migration complete.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
