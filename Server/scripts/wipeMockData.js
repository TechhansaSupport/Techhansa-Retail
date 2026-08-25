require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const Invoice = require('./models/Invoice');
const CreditTransaction = require('./models/CreditTransaction');
const User = require('./models/User');
const RFP = require('./models/RFP');
const Quotation = require('./models/Quotation');
const Order = require('./models/Order');
const ProcurementRequest = require('./models/ProcurementRequest');

const wipeData = async () => {
  try {
    await connectDB();
    console.log('Connected to DB. Starting cleanup...');

    // 1. Delete all invoices
    const invoiceResult = await Invoice.deleteMany({});
    console.log(`Deleted ${invoiceResult.deletedCount} invoices.`);

    // 2. Delete all credit transactions
    const creditTxResult = await CreditTransaction.deleteMany({});
    console.log(`Deleted ${creditTxResult.deletedCount} credit transactions.`);

    // 2.5 Delete RFPs, Quotations, Orders
    const rfpResult = await RFP.deleteMany({});
    console.log(`Deleted ${rfpResult.deletedCount} RFPs.`);
    const quotResult = await Quotation.deleteMany({});
    console.log(`Deleted ${quotResult.deletedCount} Quotations.`);
    const orderResult = await Order.deleteMany({});
    console.log(`Deleted ${orderResult.deletedCount} Orders.`);
    const procResult = await ProcurementRequest.deleteMany({});
    console.log(`Deleted ${procResult.deletedCount} Procurement Requests.`);

    // 3. Reset credit limits for all users
    const userResult = await User.updateMany({}, {
      $set: {
        totalCredit: 0,
        usedCredit: 0,
        reservedCredit: 0
      }
    });
    console.log(`Reset credit limits for ${userResult.modifiedCount} users.`);

    console.log('Cleanup completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

wipeData();
