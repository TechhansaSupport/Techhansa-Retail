require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/techhansa')
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.log(err));

// Import Models
const StoreProfile = require('./models/StoreProfile');
const WalletTransaction = require('./models/WalletTransaction');
const B2BInvoice = require('./models/B2BInvoice');
const TechhansaCatalog = require('./models/TechhansaCatalog');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Mock Data Definitions
const STORE_ID = 'STORE-001';

const storeProfileData = {
  storeId: STORE_ID,
  storeName: "Techhansa Retail - Downtown",
  address: "123 Tech Avenue, Silicon District, NY 10001",
  manager: "Sarah Jenkins",
  employees: 5,
  timings: "9:00 AM - 8:00 PM (Mon - Sat)",
  gst: "27AADCB2230M1Z2",
  contact: "+1 555-019-2837",
  email: "downtown@techhansa.com",
  totalCredit: 500000,
  usedCredit: 0,
  reservedCredit: 0,
  todaysSales: 210000,
  monthlySales: 1075000,
  completedOrders: 154,
  pendingOrders: 2
};

const techhansaCatalogData = [
  { catalogId: "CAT-001", category: "Laptops", name: "Lenovo ThinkPad E14", specs: "Intel Core i5, 16GB RAM, 512GB SSD", b2bPrice: 52000 },
  { catalogId: "CAT-002", category: "Laptops", name: "Dell Vostro 3420", specs: "Intel Core i3, 8GB RAM, 256GB SSD", b2bPrice: 31000 },
  { catalogId: "CAT-003", category: "Desktops", name: "HP ProDesk 400 G7", specs: "Intel Core i5, 8GB RAM, 1TB HDD", b2bPrice: 38000 },
  { catalogId: "CAT-004", category: "Networking", name: "TP-Link Archer AX73", specs: "AX5400 Dual-Band Gigabit Wi-Fi 6 Router", b2bPrice: 8500 },
  { catalogId: "CAT-005", category: "Accessories", name: "Logitech K380", specs: "Multi-Device Bluetooth Keyboard", b2bPrice: 2400 },
];

const b2bInvoicesData = [
  { storeId: STORE_ID, invoiceNo: "INV-B2B-1044", requestId: "REQ-001", amount: 156000, status: "Pending", invoiceFile: "inv-1044.pdf", createdAt: new Date("2026-08-05") },
  { storeId: STORE_ID, invoiceNo: "INV-B2B-1045", requestId: "REQ-002", amount: 45000, status: "Pending", invoiceFile: "inv-1045.pdf", createdAt: new Date("2026-08-06") },
  { storeId: STORE_ID, invoiceNo: "INV-B2B-1042", requestId: "REQ-003", amount: 85000, status: "Paid", invoiceFile: "inv-1042.pdf", createdAt: new Date("2026-08-02") },
];

const walletTransactionsData = [
  { storeId: STORE_ID, txnId: "TXN-9081", date: new Date("2026-08-07"), type: "Credit In", amount: 200000, status: "Success", closingBalance: 125000 },
  { storeId: STORE_ID, txnId: "TXN-9080", date: new Date("2026-08-02"), type: "Debit Out", amount: 85000, status: "Success", closingBalance: -75000 },
  { storeId: STORE_ID, txnId: "TXN-9075", date: new Date("2026-07-28"), type: "Credit In", amount: 150000, status: "Success", closingBalance: 10000 }
];

const inventoryData = [
  { storeId: STORE_ID, sku: "LAP-HP-001", name: "HP Pavilion x360", brand: "HP", model: "14-dw1013tu", specs: "Intel Core i5, 8GB RAM", serialNumber: "HPX360-9821A", category: "Laptops", quantity: 25, buyingPrice: 45000, mrp: 55000, sellingPrice: 52000 },
  { storeId: STORE_ID, sku: "DESK-DELL-002", name: "Dell Inspiron 3891", brand: "Dell", model: "Inspiron Desktop", specs: "Intel Core i3, 8GB RAM", serialNumber: "DLL-3891-B7C", category: "Desktops", quantity: 12, buyingPrice: 32000, mrp: 40000, sellingPrice: 38000 },
  { storeId: STORE_ID, sku: "PRN-CAN-003", name: "Canon PIXMA G3000", brand: "Canon", model: "G3000", specs: "All-in-One Ink Tank", serialNumber: "CAN-G3K-991", category: "Printers", quantity: 8, buyingPrice: 11000, mrp: 14500, sellingPrice: 13500 },
  { storeId: STORE_ID, sku: "MON-LG-004", name: "LG 24 inch IPS", brand: "LG", model: "24MP400", specs: "24-inch FHD IPS", serialNumber: "LG-24M-8822", category: "Monitors", quantity: 30, buyingPrice: 8500, mrp: 11500, sellingPrice: 10500 },
  { storeId: STORE_ID, sku: "ACC-LOGI-005", name: "Logitech MX Master 3S", brand: "Logitech", model: "MX 3S", specs: "Wireless Mouse", serialNumber: "LOG-MX3-111", category: "Accessories", quantity: 15, buyingPrice: 7000, mrp: 9500, sellingPrice: 9000 },
  { storeId: STORE_ID, sku: "NET-CIS-006", name: "Cisco RV160W VPN Router", brand: "Cisco", model: "RV160W", specs: "Wireless VPN Router", serialNumber: "MAC-00:1A:2B", category: "Networking", quantity: 4, buyingPrice: 18000, mrp: 24000, sellingPrice: 22000 },
];

const seedDB = async () => {
  try {
    // Clear existing franchise data
    await StoreProfile.deleteMany({ storeId: STORE_ID });
    await WalletTransaction.deleteMany({ storeId: STORE_ID });
    await B2BInvoice.deleteMany({ storeId: STORE_ID });
    await TechhansaCatalog.deleteMany({});
    
    // Clear store specific products just for clean slate
    await Product.deleteMany({ storeId: STORE_ID });
    
    // Insert new data
    await StoreProfile.create(storeProfileData);
    await WalletTransaction.insertMany(walletTransactionsData);
    await B2BInvoice.insertMany(b2bInvoicesData);
    await TechhansaCatalog.insertMany(techhansaCatalogData);
    await Product.insertMany(inventoryData);
    
    // Also make sure we have a sample employee
    const existingEmployee = await User.findOne({ userId: 'EMP-001' });
    if (!existingEmployee) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await User.create({
        userId: 'EMP-001',
        name: 'John Doe',
        email: 'john@techhansa.com',
        phone: '+1 555-010-1001',
        role: 'employee',
        storeId: STORE_ID,
        password: hashedPassword
      });
    }

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding DB:", error);
    mongoose.connection.close();
  }
};

seedDB();
