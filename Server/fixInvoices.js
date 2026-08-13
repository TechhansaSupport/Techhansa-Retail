const mongoose = require('mongoose');
require('dotenv').config();
const Invoice = require('./models/Invoice');

async function fixInvoices() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://developer:68K6Zg5x6f91j00U@techhansa.t8yos.mongodb.net/techhansa?retryWrites=true&w=majority';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const invoices = await Invoice.find({});
    console.log(`Found ${invoices.length} invoices to update...`);

    for (const invoice of invoices) {
      // Re-saving the invoice will trigger the pre('save') hook we just added,
      // correctly populating receivedAmount and balanceAmount
      await invoice.save();
    }

    console.log('Successfully updated all existing invoices!');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing invoices:', err);
    process.exit(1);
  }
}

fixInvoices();
