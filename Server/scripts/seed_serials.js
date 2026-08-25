const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Product = require('./models/Product');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({});
  
  for (const p of products) {
    if (!p.serialNumbers || p.serialNumbers.length === 0) {
      const quantity = p.quantity || 0;
      if (quantity > 0) {
        const serials = [];
        for (let i = 0; i < quantity; i++) {
          serials.push(`SN-${p.model.replace(/\s+/g, '').substring(0,3).toUpperCase()}-${Math.floor(Math.random()*10000)}`);
        }
        p.serialNumbers = serials;
        await p.save();
      }
    }
  }

  console.log("Mock serial numbers generated!");
  process.exit(0);
}

seed();
