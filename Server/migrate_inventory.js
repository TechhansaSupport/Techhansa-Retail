const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Product = require('./models/Product');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({});
  
  const grouped = {};
  for (const p of products) {
    const key = `${p.storeId}_${p.model}_${p.specs}`;
    if (!grouped[key]) {
      grouped[key] = {
        mainId: p._id,
        items: [p]
      };
    } else {
      grouped[key].items.push(p);
    }
  }

  for (const key in grouped) {
    const group = grouped[key];
    if (group.items.length > 1) {
      const main = group.items[0];
      const serials = new Set(main.serialNumbers || []);
      if (main.serialNumber) serials.add(main.serialNumber);
      
      let addedQty = 0;
      let addedAvail = 0;
      
      for (let i = 1; i < group.items.length; i++) {
        const item = group.items[i];
        if (item.serialNumber) serials.add(item.serialNumber);
        if (item.serialNumbers) {
          item.serialNumbers.forEach(s => serials.add(s));
        }
        addedQty += item.quantity || 0;
        addedAvail += item.availableStock || 0;
        
        await Product.findByIdAndDelete(item._id);
      }
      
      main.quantity += addedQty;
      main.availableStock += addedAvail;
      main.serialNumbers = Array.from(serials);
      main.serialNumber = undefined;
      await main.save();
    }
  }
  
  for (const key in grouped) {
    const group = grouped[key];
    if (group.items.length === 1) {
      const main = group.items[0];
      const serials = new Set(main.serialNumbers || []);
      if (main.serialNumber) {
        serials.add(main.serialNumber);
      }
      if (serials.size > 0 && (!main.serialNumbers || main.serialNumbers.length !== serials.size)) {
        main.serialNumbers = Array.from(serials);
        main.serialNumber = undefined;
        await main.save();
      }
    }
  }

  console.log("Migration complete!");
  process.exit(0);
}

migrate();
