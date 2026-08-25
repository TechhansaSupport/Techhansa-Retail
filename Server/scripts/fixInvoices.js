const mongoose = require('mongoose');
require('dotenv').config();

const RFP = require('./models/RFP');
const Quotation = require('./models/Quotation');
const Order = require('./models/Order');
const Invoice = require('./models/Invoice');

const fixInvoices = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://developer:68K6Zg5x6f91j00U@techhansa.t8yos.mongodb.net/techhansa?retryWrites=true&w=majority';
    await mongoose.connect(mongoURI);
    console.log('Connected to DB');

    const invoices = await Invoice.find({ $or: [{ items: { $size: 0 } }, { items: { $exists: false } }] });
    console.log(`Found ${invoices.length} invoices with no items.`);

    for (let inv of invoices) {
      if (inv.orderReference) {
        const order = await Order.findById(inv.orderReference);
        if (order && order.quotationReference) {
          const qt = await Quotation.findById(order.quotationReference);
          if (qt && qt.rfpReference) {
            const rfp = await RFP.findById(qt.rfpReference);
            if (rfp && rfp.products && rfp.products.length > 0) {
              const mappedItems = rfp.products.map(p => {
                const rate = p.price || (inv.amount / rfp.products.reduce((acc, x) => acc + x.quantity, 0)) / 1.18 || 0;
                return {
                  productName: p.category || '',
                  brand: p.brand || '',
                  model: p.model || '',
                  configuration: p.configuration || '',
                  quantity: p.quantity || 1,
                  unitPrice: rate,
                  totalAmount: rate * (p.quantity || 1) * 1.18,
                  hsn: p.hsn || '-',
                  taxRate: p.taxRate || 18
                };
              });
              inv.items = mappedItems;
              await inv.save();
              console.log(`Fixed Invoice ${inv.invoiceNumber}`);
            }
          }
        }
      }
    }
    
    // Also fix any pending orders/quotations with missing items
    const orders = await Order.find({ $or: [{ items: { $size: 0 } }, { items: { $exists: false } }] });
    for(let ord of orders) {
       if (ord.quotationReference) {
          const qt = await Quotation.findById(ord.quotationReference);
          if (qt && qt.rfpReference) {
            const rfp = await RFP.findById(qt.rfpReference);
            if (rfp && rfp.products && rfp.products.length > 0) {
              const mappedItems = rfp.products.map(p => ({
                productName: p.category || '',
                brand: p.brand || '',
                model: p.model || '',
                configuration: p.configuration || '',
                quantity: p.quantity || 1,
                unitPrice: p.price || 0,
                totalAmount: (p.price || 0) * (p.quantity || 1) * 1.18,
                hsn: p.hsn || '-',
                taxRate: p.taxRate || 18
              }));
              ord.items = mappedItems;
              await ord.save();
              
              qt.items = mappedItems;
              await qt.save();
              console.log(`Fixed Order ${ord.orderNumber} and Quotation ${qt.quotationNo}`);
            }
          }
       }
    }

    console.log('Done fixing data!');
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
};
fixInvoices();
