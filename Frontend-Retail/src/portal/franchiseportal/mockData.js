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
  { id: 1, sku: "LAP-HP-001", name: "HP Pavilion x360", brand: "HP", model: "14-dw1013tu", category: "Laptops", qty: 25, buyingPrice: 45000, sellingPrice: 52000, availableStock: 22, reservedStock: 3, lowStockAlert: 5 },
  { id: 2, sku: "DESK-DELL-002", name: "Dell Inspiron 3891", brand: "Dell", model: "Inspiron Desktop", category: "Desktops", qty: 12, buyingPrice: 32000, sellingPrice: 38000, availableStock: 12, reservedStock: 0, lowStockAlert: 3 },
  { id: 3, sku: "PRN-CAN-003", name: "Canon PIXMA G3000", brand: "Canon", model: "G3000", category: "Printers", qty: 8, buyingPrice: 11000, sellingPrice: 13500, availableStock: 4, reservedStock: 4, lowStockAlert: 5 },
  { id: 4, sku: "MON-LG-004", name: "LG 24 inch IPS", brand: "LG", model: "24MP400", category: "Monitors", qty: 30, buyingPrice: 8500, sellingPrice: 10500, availableStock: 28, reservedStock: 2, lowStockAlert: 10 },
  { id: 5, sku: "ACC-LOGI-005", name: "Logitech MX Master 3S", brand: "Logitech", model: "MX 3S", category: "Accessories", qty: 15, buyingPrice: 7000, sellingPrice: 9000, availableStock: 15, reservedStock: 0, lowStockAlert: 5 },
  { id: 6, sku: "NET-CIS-006", name: "Cisco RV160W VPN Router", brand: "Cisco", model: "RV160W", category: "Networking", qty: 4, buyingPrice: 18000, sellingPrice: 22000, availableStock: 2, reservedStock: 2, lowStockAlert: 5 },
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
  completedOrders: 154 // all time
};
