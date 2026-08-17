const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Techhansa:Techhansa123@cluster0.sp6eflq.mongodb.net/techhansa-retail?retryWrites=true&w=majority')
  .then(async () => {
    const StoreProfile = require('./models/StoreProfile');
    let profile = await StoreProfile.findOne({ storeId: 'STORE-001' });
    console.log('Current profile:', profile);
    
    if (profile) {
      profile.totalCredit = 10000000;
      await profile.save();
      console.log('Updated profile:', profile);
    }
    
    process.exit();
  });
