require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://developer:68K6Zg5x6f91j00U@techhansa.t8yos.mongodb.net/techhansa?retryWrites=true&w=majority').then(async () => {
  const StoreProfile = require('./models/StoreProfile');
  const profiles = await StoreProfile.find();
  for (let p of profiles) {
    if (p.walletBalance !== undefined) {
      p.totalCredit = p.walletBalance > 0 ? p.walletBalance : 500000;
      p.usedCredit = 0;
      p.reservedCredit = 0;
      p.walletBalance = undefined;
      await p.save();
    }
  }
  await mongoose.connection.db.collection('storeprofiles').updateMany({}, { $unset: { walletBalance: 1 } });
  console.log('Migrated profiles:', profiles.length);
  process.exit(0);
}).catch(console.error);
