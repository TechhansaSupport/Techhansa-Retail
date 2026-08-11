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
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Good practice for form submissions

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

app.use('/api/contact', contactRoute);
app.use('/api/franchise', franchiseRoute);
app.use('/api/channel', channelRoute);
app.use('/api/submissions', submissionsRoute);
app.use('/api/auth', authRoute);
app.use('/api/procurement', procurementRoute);
app.use('/api/settings', settingsRoute);
app.use('/api/inventory', inventoryRoute);
app.use('/api/sales', salesRoute);

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