const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Order = require('./models/Order');
const CreditTransaction = require('./models/CreditTransaction');

const USER_ID = 'channel123';

const fixCredit = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://developer:68K6Zg5x6f91j00U@techhansa.t8yos.mongodb.net/techhansa?retryWrites=true&w=majority';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ userId: USER_ID });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    // Reset used and reserved credit (but keep the 500,000 total)
    user.reservedCredit = 0;
    user.usedCredit = 0;
    
    // Delete all existing credit transactions EXCEPT the initial assignment
    await CreditTransaction.deleteMany({ userId: USER_ID, type: { $ne: 'Assigned' } });

    // Find all mock orders that used credit
    const orders = await Order.find({ userId: USER_ID, paymentMethod: 'Credit' });
    
    for (const order of orders) {
      const amount = order.totalAmount;
      
      // We'll mark them all as reserved for now, since they are still in various stages
      // Or if Delivered, we mark them as used.
      if (order.status === 'Delivered') {
        user.usedCredit += amount;
        
        await new CreditTransaction({
          userId: USER_ID,
          type: 'Deducted',
          amount: amount,
          referenceId: order.orderNumber,
          description: `Credit used for delivered Order ${order.orderNumber}`
        }).save();
      } else {
        user.reservedCredit += amount;
        
        await new CreditTransaction({
          userId: USER_ID,
          type: 'Reserved',
          amount: amount,
          referenceId: order.orderNumber,
          description: `Reserved credit for Order ${order.orderNumber}`
        }).save();
      }
    }

    await user.save();

    console.log('Successfully synced User Credit Limit with Mock Orders!');
    console.log(`Total Credit: ${user.totalCredit}`);
    console.log(`Used Credit: ${user.usedCredit}`);
    console.log(`Reserved Credit: ${user.reservedCredit}`);

    process.exit(0);
  } catch (error) {
    console.error('Error fixing credit:', error);
    process.exit(1);
  }
};

fixCredit();
