require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Import Routes
const contactRoute = require('./routes/contact');

// Use Routes (Ye 'http://localhost:5000/api/contact' par bind ho jayega)
app.use('/api/contact', contactRoute);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});