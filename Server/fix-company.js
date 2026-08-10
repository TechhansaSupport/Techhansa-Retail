require('dotenv').config();
const mongoose = require('mongoose');
const CompanySettings = require('./models/CompanySettings');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const settings = await CompanySettings.findOne();
  if (settings) {
    settings.companyName = 'Techhansa Retail';
    settings.bankDetails.accountHolderName = 'Techhansa Retail';
    await settings.save();
    console.log('Updated existing settings');
  } else {
    console.log('No settings found, creating one...');
    await CompanySettings.create({
      companyName: 'Techhansa Retail',
      bankDetails: { accountHolderName: 'Techhansa Retail' }
    });
    console.log('Created settings');
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
