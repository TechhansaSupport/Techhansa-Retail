// src/portal/franchiseportal/mockData.js

export const storeProfile = {
  storeName: "Techhansa Retail - Downtown",
  address: "123 Tech Avenue, Silicon District, NY 10001",
  manager: "Sarah Jenkins",
  employees: 5,
  timings: "9:00 AM - 8:00 PM (Mon - Sat)",
  gst: "27AADCB2230M1Z2",
  contact: "+1 555-019-2837",
  email: "downtown@techhansa.com"
};

export const inventoryData = [
  { id: 1, sku: "LAP-HP-001", name: "HP Pavilion x360", brand: "HP", model: "14-dw1013tu", serialNumber: "HPX360-9821A", category: "Laptops", qty: 25, buyingPrice: 45000, mrp: 55000, sellingPrice: 52000, availableStock: 22, reservedStock: 3, lowStockAlert: 5 },
  { id: 2, sku: "DESK-DELL-002", name: "Dell Inspiron 3891", brand: "Dell", model: "Inspiron Desktop", serialNumber: "DLL-3891-B7C", category: "Desktops", qty: 12, buyingPrice: 32000, mrp: 40000, sellingPrice: 38000, availableStock: 12, reservedStock: 0, lowStockAlert: 3 },
  { id: 3, sku: "PRN-CAN-003", name: "Canon PIXMA G3000", brand: "Canon", model: "G3000", serialNumber: "CAN-G3K-991", category: "Printers", qty: 8, buyingPrice: 11000, mrp: 14500, sellingPrice: 13500, availableStock: 4, reservedStock: 4, lowStockAlert: 5 },
  { id: 4, sku: "MON-LG-004", name: "LG 24 inch IPS", brand: "LG", model: "24MP400", serialNumber: "LG-24M-8822", category: "Monitors", qty: 30, buyingPrice: 8500, mrp: 11500, sellingPrice: 10500, availableStock: 28, reservedStock: 2, lowStockAlert: 10 },
  { id: 5, sku: "ACC-LOGI-005", name: "Logitech MX Master 3S", brand: "Logitech", model: "MX 3S", serialNumber: "LOG-MX3-111", category: "Accessories", qty: 15, buyingPrice: 7000, mrp: 9500, sellingPrice: 9000, availableStock: 15, reservedStock: 0, lowStockAlert: 5 },
  { id: 6, sku: "NET-CIS-006", name: "Cisco RV160W VPN Router", brand: "Cisco", model: "RV160W", serialNumber: "MAC-00:1A:2B", category: "Networking", qty: 4, buyingPrice: 18000, mrp: 24000, sellingPrice: 22000, availableStock: 2, reservedStock: 2, lowStockAlert: 5 },
];

export const orderData = [
  { id: "ORD-001", date: "2026-08-01", items: 20, total: 900000, status: "Delivered", expectedDelivery: "2026-08-03" },
  { id: "ORD-002", date: "2026-08-03", items: 5, total: 35000, status: "Dispatched", expectedDelivery: "2026-08-06" },
  { id: "ORD-003", date: "2026-08-04", items: 10, total: 110000, status: "Approved", expectedDelivery: "2026-08-08" },
  { id: "ORD-004", date: "2026-08-04", items: 50, total: 425000, status: "Pending", expectedDelivery: "TBD" },
];

export const salesData = [
  { date: "Aug 1", sales: 120000, orders: 8 },
  { date: "Aug 2", sales: 150000, orders: 12 },
  { date: "Aug 3", sales: 85000, orders: 6 },
  { date: "Aug 4", sales: 210000, orders: 15 },
  { date: "Aug 5", sales: 175000, orders: 11 },
  { date: "Aug 6", sales: 140000, orders: 9 },
  { date: "Aug 7", sales: 195000, orders: 14 },
];

export const summaryMetrics = {
  totalInventory: 94,
  availableStock: 83,
  todaysSales: 210000,
  monthlySales: 1075000,
  pendingOrders: 2, // pending & approved
  completedOrders: 154, // all time
  walletBalance: 125000,
  topEmployee: { name: 'John Doe', sales: 125000 }
};

export const techhansaCatalog = [
  { id: "CAT-001", category: "Laptops", name: "Lenovo ThinkPad E14", specs: "Intel Core i5, 16GB RAM, 512GB SSD", b2bPrice: 52000 },
  { id: "CAT-002", category: "Laptops", name: "Dell Vostro 3420", specs: "Intel Core i3, 8GB RAM, 256GB SSD", b2bPrice: 31000 },
  { id: "CAT-003", category: "Desktops", name: "HP ProDesk 400 G7", specs: "Intel Core i5, 8GB RAM, 1TB HDD", b2bPrice: 38000 },
  { id: "CAT-004", category: "Networking", name: "TP-Link Archer AX73", specs: "AX5400 Dual-Band Gigabit Wi-Fi 6 Router", b2bPrice: 8500 },
  { id: "CAT-005", category: "Accessories", name: "Logitech K380", specs: "Multi-Device Bluetooth Keyboard", b2bPrice: 2400 },
];

export const b2bInvoices = [
  { id: "INV-B2B-1044", date: "2026-08-05", amount: 156000, status: "Pending" },
  { id: "INV-B2B-1045", date: "2026-08-06", amount: 45000, status: "Pending" },
  { id: "INV-B2B-1042", date: "2026-08-02", amount: 85000, status: "Paid" },
];

export const walletTransactions = [
  { id: "TXN-9081", date: "2026-08-07", type: "Credit In", amount: 200000, status: "Success", closingBalance: 125000 },
  { id: "TXN-9080", date: "2026-08-02", type: "Debit Out", amount: 85000, status: "Success", closingBalance: -75000 }, // illustrative relative
  { id: "TXN-9075", date: "2026-07-28", type: "Credit In", amount: 150000, status: "Success", closingBalance: 10000 }
];

export const employeesData = [
  { id: "EMP-001", name: "John Doe", email: "john@techhansa.com", phone: "+1 555-010-1001", totalSales: 125000, status: "Active" },
  { id: "EMP-002", name: "Jane Smith", email: "jane@techhansa.com", phone: "+1 555-010-1002", totalSales: 89000, status: "Active" },
  { id: "EMP-003", name: "Mike Johnson", email: "mike@techhansa.com", phone: "+1 555-010-1003", totalSales: 45000, status: "Inactive" },
];
