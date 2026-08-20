const mongoose = require('mongoose');
require('dotenv').config();

const RFP = require('./models/RFP');
const Quotation = require('./models/Quotation');
const Order = require('./models/Order');
const Invoice = require('./models/Invoice');

const USER_ID = 'channel123';

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://developer:68K6Zg5x6f91j00U@techhansa.t8yos.mongodb.net/techhansa?retryWrites=true&w=majority';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Remove existing mock data if needed? We will just append.

    // 1. RFPs
    const rfpStatuses = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Quotation Received'];
    const rfpDocs = [];
    
    for (let i = 0; i < rfpStatuses.length; i++) {
      const rfp = new RFP({
        rfpId: `RFP-MOCK-${Date.now()}-${i}`,
        title: `Mock RFP - ${rfpStatuses[i]}`,
        requirementName: `Hardware Upgrade ${i}`,
        userId: USER_ID,
        status: rfpStatuses[i],
        priority: 'Medium',
        expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        products: [
          { category: 'IT Hardware', brand: 'Dell', model: 'Latitude', configuration: 'i7/16GB/512GB', quantity: 5 }
        ]
      });
      await rfp.save();
      rfpDocs.push(rfp);
      console.log(`Created RFP with status: ${rfpStatuses[i]}`);
    }

    // 2. Quotations
    const qtStatuses = ['Pending', 'Approved', 'Rejected'];
    const qtDocs = [];

    for (let i = 0; i < qtStatuses.length; i++) {
      const qt = new Quotation({
        quotationNo: `QT-MOCK-${Date.now()}-${i}`,
        rfpReference: rfpDocs[0]._id, // Just link to first mock rfp
        vendor: 'Tech Solutions Inc',
        amount: Math.floor(Math.random() * 50000) + 10000,
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: qtStatuses[i],
        userId: USER_ID,
        items: [
          {
            productName: 'Mock Laptop',
            brand: 'Dell',
            model: 'Latitude 7420',
            configuration: 'i7/16GB/512GB',
            quantity: 5,
            unitPrice: 40000,
            totalAmount: 200000,
            hsn: '84713010',
            taxRate: 18
          }
        ]
      });
      await qt.save();
      qtDocs.push(qt);
      console.log(`Created Quotation with status: ${qtStatuses[i]}`);
    }

    // 3. Orders
    const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'];
    const orderDocs = [];

    for (let i = 0; i < orderStatuses.length; i++) {
      const order = new Order({
        orderNumber: `ORD-MOCK-${Date.now()}-${i}`,
        quotationReference: qtDocs[0]._id, // Link to first mock quotation
        expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: orderStatuses[i],
        totalAmount: Math.floor(Math.random() * 50000) + 10000,
        paymentMethod: 'Credit',
        paymentStatus: 'Reserved',
        userId: USER_ID,
        items: [
          {
            productName: 'Mock Laptop',
            brand: 'Dell',
            model: 'Latitude 7420',
            configuration: 'i7/16GB/512GB',
            quantity: 5,
            unitPrice: 40000,
            totalAmount: 200000,
            hsn: '84713010',
            taxRate: 18
          }
        ]
      });
      await order.save();
      orderDocs.push(order);
      console.log(`Created Order with status: ${orderStatuses[i]}`);
    }

    // 4. Invoices
    const invoiceStatuses = ['Unpaid', 'Paid', 'Overdue'];
    
    for (let i = 0; i < invoiceStatuses.length; i++) {
      const invoice = new Invoice({
        invoiceNumber: `INV-MOCK-${Date.now()}-${i}`,
        orderReference: orderDocs[0]._id, // Link to first mock order
        amount: Math.floor(Math.random() * 50000) + 10000,
        paymentStatus: invoiceStatuses[i],
        dueDate: new Date(Date.now() + (invoiceStatuses[i] === 'Overdue' ? -5 : 5) * 24 * 60 * 60 * 1000),
        userId: USER_ID,
        items: [
          {
            productName: 'Mock Laptop',
            brand: 'Dell',
            model: 'Latitude 7420',
            configuration: 'i7/16GB/512GB',
            quantity: 5,
            unitPrice: 40000,
            totalAmount: 200000,
            hsn: '84713010',
            taxRate: 18
          }
        ]
      });
      await invoice.save();
      console.log(`Created Invoice with status: ${invoiceStatuses[i]}`);
    }

    console.log('Successfully seeded all mock data!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
