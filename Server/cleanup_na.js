const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Product = require('./models/Product');
const PR = require('./models/ProcurementRequest');

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const naProducts = await Product.find({ brand: 'N/A' });
  
  for (const prod of naProducts) {
    if (prod.serialNumbers && prod.serialNumbers.length > 0) {
      // Find what it was originally
      const prs = await PR.find({ 'items.assignedSerials': prod.serialNumbers[0] });
      if (prs.length > 0) {
        let originalItem = null;
        for (const pr of prs) {
          for (const item of pr.items) {
            if (item.assignedSerials && item.assignedSerials.includes(prod.serialNumbers[0])) {
              originalItem = item;
              break;
            }
          }
          if (originalItem) break;
        }

        if (originalItem) {
          prod.brand = originalItem.brand || 'N/A';
          prod.model = originalItem.hardwareType || originalItem.model || 'N/A';
          prod.category = originalItem.hardwareType || originalItem.category || 'N/A';
          prod.specs = typeof originalItem.specs === 'string' ? originalItem.specs : JSON.stringify(originalItem.specs || {});
          prod.name = originalItem.productName || originalItem.hardwareType || 'Product';
          prod.sellingPrice = originalItem.price || 0;
          await prod.save();
          console.log(`Fixed product ${prod._id} to ${prod.brand} ${prod.model}`);
          continue;
        }
      }
    }
    
    console.log(`Could not find original PR for N/A product ${prod._id}, deleting it`);
    await Product.findByIdAndDelete(prod._id);
  }
  
  process.exit(0);
}

cleanup();
