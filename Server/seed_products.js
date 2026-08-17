const mongoose = require('mongoose');
const GlobalProduct = require('./models/GlobalProduct');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Remove Smartphones
      await GlobalProduct.deleteMany({ category: 'Smartphones' });
      console.log('Removed Smartphones from the catalog.');

      const generateSN = (index) => 'SN-' + Date.now() + '-' + index;

      const products = [
        // Laptops
        {
          serialNumber: generateSN(1),
          category: 'Laptops',
          brand: 'HP',
          model: 'Spectre x360',
          name: 'HP Spectre x360',
          buyingPrice: 90000,
          mrp: 130000,
          sellingPrice: 115000,
          specs: 'Intel Core i7 13th Gen, 16GB RAM, 512GB SSD NVMe, 13.5" OLED Touch',
          availableStock: 15,
          quantity: 15,
          lowStockAlert: 3
        },
        {
          serialNumber: generateSN(2),
          category: 'Laptops',
          brand: 'Lenovo',
          model: 'ThinkPad X1 Carbon',
          name: 'Lenovo ThinkPad X1 Carbon',
          buyingPrice: 100000,
          mrp: 150000,
          sellingPrice: 135000,
          specs: 'Intel Core i7 13th Gen, 16GB RAM, 1TB SSD NVMe, 14" WUXGA',
          availableStock: 20,
          quantity: 20,
          lowStockAlert: 5
        },
        {
          serialNumber: generateSN(3),
          category: 'Laptops',
          brand: 'Apple',
          model: 'MacBook Pro 14',
          name: 'Apple MacBook Pro 14',
          buyingPrice: 140000,
          mrp: 199000,
          sellingPrice: 185000,
          specs: 'M3 Pro Chip, 18GB Unified Memory, 512GB SSD, 14.2" Liquid Retina XDR',
          availableStock: 10,
          quantity: 10,
          lowStockAlert: 2
        },

        // Monitors
        {
          serialNumber: generateSN(4),
          category: 'Monitors',
          brand: 'Dell',
          model: 'UltraSharp U2720Q',
          name: 'Dell UltraSharp U2720Q',
          buyingPrice: 35000,
          mrp: 55000,
          sellingPrice: 48000,
          specs: '27-inch 4K UHD (3840 x 2160), USB-C, IPS Panel',
          availableStock: 30,
          quantity: 30,
          lowStockAlert: 5
        },
        {
          serialNumber: generateSN(5),
          category: 'Monitors',
          brand: 'BenQ',
          model: 'PD2700U',
          name: 'BenQ PD2700U',
          buyingPrice: 30000,
          mrp: 45000,
          sellingPrice: 39000,
          specs: '27-inch 4K UHD, HDR10, 100% sRGB, IPS Panel',
          availableStock: 25,
          quantity: 25,
          lowStockAlert: 4
        },

        // Keyboards
        {
          serialNumber: generateSN(6),
          category: 'Keyboards',
          brand: 'Logitech',
          model: 'MX Keys',
          name: 'Logitech MX Keys',
          buyingPrice: 8000,
          mrp: 12995,
          sellingPrice: 10500,
          specs: 'Wireless, Illuminated, USB-C Rechargeable, Multi-Device',
          availableStock: 50,
          quantity: 50,
          lowStockAlert: 10
        },
        {
          serialNumber: generateSN(7),
          category: 'Keyboards',
          brand: 'Keychron',
          model: 'K2 Wireless',
          name: 'Keychron K2 Wireless Mechanical',
          buyingPrice: 6500,
          mrp: 9999,
          sellingPrice: 8500,
          specs: 'Wireless Mechanical, Gateron Brown Switches, White Backlight',
          availableStock: 40,
          quantity: 40,
          lowStockAlert: 8
        },

        // Mice
        {
          serialNumber: generateSN(8),
          category: 'Mice',
          brand: 'Logitech',
          model: 'MX Master 3S',
          name: 'Logitech MX Master 3S',
          buyingPrice: 7000,
          mrp: 10995,
          sellingPrice: 9500,
          specs: 'Wireless, 8000 DPI, Quiet Clicks, Ergonomic',
          availableStock: 60,
          quantity: 60,
          lowStockAlert: 10
        },
        {
          serialNumber: generateSN(9),
          category: 'Mice',
          brand: 'Razer',
          model: 'DeathAdder V2',
          name: 'Razer DeathAdder V2',
          buyingPrice: 3500,
          mrp: 5999,
          sellingPrice: 4800,
          specs: 'Wired, 20000 DPI Optical Sensor, Ergonomic',
          availableStock: 45,
          quantity: 45,
          lowStockAlert: 10
        },

        // Printers
        {
          serialNumber: generateSN(10),
          category: 'Printers',
          brand: 'HP',
          model: 'LaserJet Pro M15w',
          name: 'HP LaserJet Pro M15w',
          buyingPrice: 9000,
          mrp: 13500,
          sellingPrice: 11500,
          specs: 'Monochrome Laser, Wireless, Print only, 19 ppm',
          availableStock: 20,
          quantity: 20,
          lowStockAlert: 4
        },
        {
          serialNumber: generateSN(11),
          category: 'Printers',
          brand: 'Epson',
          model: 'EcoTank L3250',
          name: 'Epson EcoTank L3250',
          buyingPrice: 11000,
          mrp: 17000,
          sellingPrice: 14500,
          specs: 'Color Ink Tank, Wi-Fi, Print/Scan/Copy',
          availableStock: 15,
          quantity: 15,
          lowStockAlert: 3
        },

        // RAMs
        {
          serialNumber: generateSN(12),
          category: 'RAMs',
          brand: 'Corsair',
          model: 'Vengeance LPX 16GB (2x8GB) DDR4',
          name: 'Corsair Vengeance LPX 16GB DDR4',
          buyingPrice: 3500,
          mrp: 6500,
          sellingPrice: 4800,
          specs: '16GB (2x8GB) DDR4 3200MHz C16 Desktop Memory',
          availableStock: 100,
          quantity: 100,
          lowStockAlert: 20
        },
        {
          serialNumber: generateSN(13),
          category: 'RAMs',
          brand: 'Crucial',
          model: '16GB DDR5 4800MHz',
          name: 'Crucial 16GB DDR5 4800MHz',
          buyingPrice: 4500,
          mrp: 8000,
          sellingPrice: 6200,
          specs: '16GB DDR5 4800MHz CL40 Desktop Memory',
          availableStock: 80,
          quantity: 80,
          lowStockAlert: 15
        },

        // Utilities/Accessories
        {
          serialNumber: generateSN(14),
          category: 'Utilities',
          brand: 'Belkin',
          model: 'SurgePlus 6-Outlet',
          name: 'Belkin SurgePlus 6-Outlet Surge Protector',
          buyingPrice: 1200,
          mrp: 2500,
          sellingPrice: 1800,
          specs: '6-Outlet Surge Protector with 2 USB Ports',
          availableStock: 150,
          quantity: 150,
          lowStockAlert: 25
        },
        {
          serialNumber: generateSN(15),
          category: 'Utilities',
          brand: 'Anker',
          model: 'PowerPort Strip PD 3',
          name: 'Anker PowerPort Strip PD 3',
          buyingPrice: 2500,
          mrp: 4500,
          sellingPrice: 3500,
          specs: '3-Outlet Power Strip with 30W USB-C PD',
          availableStock: 80,
          quantity: 80,
          lowStockAlert: 15
        },
        {
          serialNumber: generateSN(16),
          category: 'Utilities',
          brand: 'SanDisk',
          model: 'Extreme Portable SSD 1TB',
          name: 'SanDisk Extreme Portable SSD 1TB',
          buyingPrice: 6500,
          mrp: 12000,
          sellingPrice: 8900,
          specs: '1TB NVMe Solid State Performance, USB-C',
          availableStock: 60,
          quantity: 60,
          lowStockAlert: 10
        }
      ];

      await GlobalProduct.insertMany(products);
      console.log('Successfully added new diverse products to Central Catalogue!');
    } catch (err) {
      console.error('Error adding products:', err);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
