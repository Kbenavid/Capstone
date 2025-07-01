require('dotenv').config();               // Load .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // To parse & clear JWT cookies

// ─── Import Route Modules ──────────────────────────────────────────────────────
const authRoutes    = require('./routes/auth');
const partsRoutes   = require('./routes/parts');
const barcodeRoutes = require('./routes/barcodes'); // Correct if your file is barcodes.js
const jobsRoutes    = require('./routes/jobs');     // Ensure this file is named jobs.js (lowercase)

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:3000',  // React frontend origin (update for deployment if needed)
  credentials: true,                // Allow cookies
}));

app.use(express.json());         // Parse JSON request bodies
app.use(cookieParser());         // Parse cookies

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/parts',   partsRoutes);
app.use('/api/barcodes', barcodeRoutes);
app.use('/api/jobs',    jobsRoutes); // Now referencing lowercase "jobs"

// ─── Basic Test Route ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Hello from PipeTrack backend!');
});

// ─── MongoDB & Server Startup ──────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
