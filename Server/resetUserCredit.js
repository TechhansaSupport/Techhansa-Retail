const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const resetCredit = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://developer:68K6Zg5x6f91j00U@techhansa.t8yos.mongodb.net/techhansa?retryWrites=true&w=majority';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Reset totalCredit, usedCredit, and reservedCredit to 0 for all users
    const result = await User.updateMany({}, {
      $set: {
        totalCredit: 0,
        usedCredit: 0,
        reservedCredit: 0
      }
    });

    console.log(`Successfully reset credit for ${result.modifiedCount} users.`);
    process.exit(0);
  } catch (error) {
    console.error('Error resetting credit:', error);
    process.exit(1);
  }
};

resetCredit();
