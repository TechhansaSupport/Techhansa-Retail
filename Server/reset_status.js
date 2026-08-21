require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('orders').updateOne(
    { orderNumber: 'ORD-RFP-2026-504' },
    { $set: { status: 'Paid', invoiceSent: false } }
  );
  console.log('Update result:', result);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
