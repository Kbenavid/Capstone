require('dotenv').config();               // Load .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // To parse & clear JWT cookies

// Import route modules
const authRoutes    = require('./routes/auth');
const partsRoutes   = require('./routes/parts');
const barcodeRoutes = require('./routes/barcodes'); 
const jobsRoutes = require('./routes/Jobs');

const app = express();

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:3000',  // your React origin
  credentials: true,               // <–– allow cookies to be sent
}));

app.use(express.json());                   // Parse JSON bodies
app.use(cookieParser());                   // Parse cookies for JWT handling

// ─── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/auth',   authRoutes);       // Register auth endpoints
app.use('/api/parts',  partsRoutes);      // Register parts CRUD endpoints
app.use('/api/barcodes', barcodeRoutes);   // Register barcode-gen endpoint
app.use('/api/jobs', jobsRoutes);
// Register job management endpoints

// Simple root test route
app.get('/', (req, res) => {
  res.send('Hello from PipeTrack backend!');
});

// ─── DATABASE & SERVER START ───────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

