
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const B2BInvoice = require('./models/B2BInvoice');
      const b2b = await B2BInvoice.findOne({ status: 'Paid', invoiceSent: { $ne: true } });
      
      if (!b2b) {
        console.log('No eligible B2BInvoices found.');
        return;
      }
      
      console.log('Found B2BInvoice:', b2b._id);
      
      b2b.invoiceSent = true;
      await b2b.save();
      console.log('Save successful!');

    } catch (e) {
      console.error('Save failed:', e.message);
    } finally {
      setTimeout(() => mongoose.disconnect(), 2000);
    }
  });

