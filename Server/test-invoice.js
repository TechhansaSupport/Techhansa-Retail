
const mongoose = require('mongoose');
const http = require('http');
const jwt = require('jsonwebtoken');
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

      const token = jwt.sign({ id: 'fake', role: 'finance_manager' }, process.env.JWT_SECRET);

      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/admin/orders/' + b2b._id.toString() + '/invoice',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      };

      const req = http.request(options, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
      });
      req.on('error', e => console.error(e));
      req.end();

    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => mongoose.disconnect(), 2000);
    }
  });

