const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Product = require('./models/Product');

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // 1. Find all Dell UltraSharp products
  const products = await Product.find({ model: /Dell UltraSharp U2720Q/i });
  
  if (products.length > 1) {
    // Merge them all into the first one
    const main = products[0];
    
    let totalQty = main.quantity || 0;
    let totalAvail = main.availableStock || 0;
    
    let serials = new Set(main.serialNumbers || []);
    if (main.serialNumber) serials.add(main.serialNumber);

    for (let i = 1; i < products.length; i++) {
      const p = products[i];
      totalQty += p.quantity || 0;
      totalAvail += p.availableStock || 0;
      
      if (p.serialNumbers) p.serialNumbers.forEach(s => serials.add(s));
      if (p.serialNumber) serials.add(p.serialNumber);

      await Product.findByIdAndDelete(p._id);
    }
    
    main.quantity = totalQty;
    main.availableStock = totalAvail;
    main.serialNumbers = Array.from(serials);
    main.serialNumber = undefined;
    await main.save();
    console.log("Cleaned up Dell: qty is now", main.quantity, "serials:", main.serialNumbers);
  } else {
    console.log("No duplicate Dell products found");
  }

  process.exit(0);
}

cleanup();
