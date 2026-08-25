const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const CreditTransaction = require('./models/CreditTransaction');

async function assignCredit() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://developer:68K6Zg5x6f91j00U@techhansa.t8yos.mongodb.net/techhansa?retryWrites=true&w=majority';
    await mongoose.connect(mongoURI);
    
    console.log('Connected to MongoDB');

    const channelPartners = await User.find({ role: 'channel' });
    
    for (const partner of channelPartners) {
      const addedAmount = 500000;
      partner.totalCredit = (partner.totalCredit || 0) + addedAmount;
      await partner.save();

      const transaction = new CreditTransaction({
        userId: partner.userId,
        type: 'Assigned',
        amount: addedAmount,
        referenceId: 'ADMIN-SYS',
        description: 'Initial Credit Assignment by Admin'
      });
      await transaction.save();
      
      console.log(`Successfully added ${addedAmount} credit to ${partner.name || partner.userId}`);
    }

    console.log('Credit assignment complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error assigning credit:', error);
    process.exit(1);
  }
}

assignCredit();
