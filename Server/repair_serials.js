const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Order = require('./models/Order');
const Product = require('./models/Product');

async function repair() {
  await mongoose.connect(process.env.MONGO_URI);
  const orders = await Order.find({ status: { $in: ['Delivered', 'DELIVERED'] } });
  
  let count = 0;
  for(const o of orders) { 
    for(const item of o.items) { 
      if(item.assignedSerials && item.assignedSerials.length > 0) { 
        const p = await Product.findOne({ model: item.model || item.productName }); 
        if(p) { 
          const s = new Set(p.serialNumbers || []); 
          item.assignedSerials.forEach(sn => s.add(sn)); 
          p.serialNumbers = Array.from(s); 
          
          // Also set availableStock if it was out of sync?
          // Actually, let's just make sure serialNumbers is populated.
          await p.save(); 
          count++;
        } 
      } 
    } 
  } 
  console.log('Fixed ' + count + ' products.');
  process.exit(0);
}

repair();
