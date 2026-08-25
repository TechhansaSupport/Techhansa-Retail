const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const connectDB = require('./db');
require('dotenv').config();

async function seedWarehouseUser() {
  await connectDB();
  
  const existing = await User.findOne({ userId: 'warehouse123' });
  if (!existing) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const newUser = new User({
      userId: 'warehouse123',
      password: hashedPassword,
      role: 'warehouse_manager',
      name: 'Warehouse Lead',
      email: 'warehouse@techhansa.com',
      status: 'Active'
    });
    await newUser.save();
    console.log('Created warehouse_manager: warehouse123 / password123');
  } else {
    console.log('warehouse123 already exists');
  }
  process.exit();
}

seedWarehouseUser();
