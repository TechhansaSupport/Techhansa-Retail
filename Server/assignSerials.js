const mongoose = require('mongoose');
const GlobalProduct = require('./models/GlobalProduct');

// Random alphanumeric serial generator
const generateSerial = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

async function assignSerials() {
  try {
    await mongoose.connect("mongodb://customersupport_db_user:Wbu3w9LOy9kZApUc@ac-2rdrrau-shard-00-00.sp6eflq.mongodb.net:27017,ac-2rdrrau-shard-00-01.sp6eflq.mongodb.net:27017,ac-2rdrrau-shard-00-02.sp6eflq.mongodb.net:27017/Techhansa_retail?authSource=admin&replicaSet=atlas-7jnu02-shard-0&appName=Cluster0&tls=true");
    console.log('Connected to DB');

    const products = await GlobalProduct.find();
    let updatedCount = 0;

    for (let product of products) {
      if (product.quantity > 0) {
        const currentSerialsCount = product.serialNumbers ? product.serialNumbers.length : 0;
        
        // If we have fewer serial numbers than the quantity, generate the missing ones
        if (currentSerialsCount < product.quantity) {
          const needed = product.quantity - currentSerialsCount;
          const newSerials = [];
          
          for (let i = 0; i < needed; i++) {
            // Generate a prefix based on brand/model if possible, otherwise generic
            const prefix = (product.brand ? product.brand.substring(0,3).toUpperCase() : 'SN') + '-';
            newSerials.push(prefix + generateSerial(10));
          }
          
          product.serialNumbers = [...(product.serialNumbers || []), ...newSerials];
          await product.save();
          updatedCount++;
          console.log(`Assigned ${needed} serial numbers to ${product.name}`);
        }
      }
    }

    console.log(`Finished updating ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

assignSerials();
