require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import route modules
const authRoutes = require('./routes/auth');
const partsRoutes = require('./routes/parts');

const barcodeRoutes = require('./routes/barcodes'); // Import barcode routes

const app = express();

// Middleware to handle CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/parts', partsRoutes);

app.use('/api/barcodes', barcodeRoutes); // Register barcode routes

// Connect to MongoDB using connection string from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root route for simple test
app.get('/', (req, res) => {
  res.send('Hello from PipeTrack backend!');
});

// Start server on specified port or default to 5000
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

