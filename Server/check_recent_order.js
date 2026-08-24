const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const PR = require('./models/ProcurementRequest');
  const p = await PR.find({ status: { $in: ['DELIVERED', 'Delivered'] } }).sort({_id:-1}).limit(1);
  if (p.length > 0) {
    console.log('PR:', JSON.stringify(p[0].items.map(i => ({ brand: i.brand, model: i.model, hardwareType: i.hardwareType, category: i.category, qty: i.quantity, specs: i.specs, assignedSerials: i.assignedSerials })), null, 2));
  }
  process.exit(0);
}
check();
