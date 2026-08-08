require('dotenv').config();
const mongoose = require('mongoose');
const RFP = require('./models/RFP');
const Quotation = require('./models/Quotation');
const Order = require('./models/Order');
const Invoice = require('./models/Invoice');
const ChannelPartner = require('./models/ChannelPartner');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to DB');
  
  await RFP.deleteMany({});
  console.log('Cleared RFPs');
  
  await Quotation.deleteMany({});
  console.log('Cleared Quotations');
  
  await Order.deleteMany({});
  console.log('Cleared Orders');
  
  await Invoice.deleteMany({});
  console.log('Cleared Invoices');

  await ChannelPartner.deleteMany({});
  console.log('Cleared ChannelPartners');
  
  console.log('Done clearing DB!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
