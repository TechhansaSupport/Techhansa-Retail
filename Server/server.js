require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// =========================================
// MIDDLEWARE
// =========================================
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files (e.g., uploaded documents for Channel/Franchise partners)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =========================================
// API ROUTES
// =========================================
const contactRoute = require('./routes/contact');
const franchiseRoute = require('./routes/franchise');
const channelRoute = require('./routes/channel');
const submissionsRoute = require('./routes/submissions');
const authRoute = require('./routes/auth');
const procurementRoute = require('./routes/procurement');
const settingsRoute = require('./routes/settings');
const inventoryRoute = require('./routes/inventory');
const salesRoute = require('./routes/sales');
const adminRoute = require('./routes/admin');
const notificationsRoute = require('./routes/notifications');
const financeRoute = require('./routes/finance');
const warehouseRoute = require('./routes/warehouse');

const { verifyToken } = require('./middleware/auth');

app.use('/api/contact', contactRoute);
app.use('/api/franchise', verifyToken, franchiseRoute);
app.use('/api/channel', verifyToken, channelRoute);
app.use('/api/submissions', submissionsRoute);
app.use('/api/auth', authRoute);
app.use('/api/procurement', verifyToken, procurementRoute);
app.use('/api/settings', verifyToken, settingsRoute);
app.use('/api/inventory', verifyToken, inventoryRoute);
app.use('/api/sales', verifyToken, salesRoute);
app.use('/api/admin', verifyToken, adminRoute);
app.use('/api/notifications', verifyToken, notificationsRoute);
app.use('/api/finance', verifyToken, financeRoute);

// =========================================
// FRONTEND SERVING (Techhansa Retail)
// =========================================
const clientBuildPath = path.join(__dirname, "../Frontend-Retail/dist");
app.use(express.static(clientBuildPath));

// Express 5 wildcard route to handle React Router navigation
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
    if (err) {
      res.status(500).send("Frontend build not found. Make sure to run 'npm run build' in your Vite project.");
    }
  });
});

// =========================================
// INITIALIZE DATABASE & SERVER
// =========================================
async function startServer() {
  try {
    // 1. Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    // 2. Start the Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();