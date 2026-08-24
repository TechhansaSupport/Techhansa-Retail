const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Product = require('./models/Product');

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // 1. Find all Keychron products
  const products = await Product.find({ model: /Keychron K2/i });
  
  if (products.length > 0) {
    // Merge them all into the first one
    const main = products[0];
    
    // Clear out fake serials
    main.serialNumbers = [];
    main.serialNumber = undefined;
    
    let totalQty = main.quantity || 0;
    let totalAvail = main.availableStock || 0;
    
    for (let i = 1; i < products.length; i++) {
      const p = products[i];
      totalQty += p.quantity || 0;
      totalAvail += p.availableStock || 0;
      await Product.findByIdAndDelete(p._id);
    }
    
    main.quantity = totalQty;
    main.availableStock = totalAvail;
    await main.save();
    console.log("Cleaned up Keychron: qty is now", main.quantity, "serials cleared.");
  }

  process.exit(0);
}

cleanup();
