require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// ─── ROUTES ─────────────────────────────────────────────────
const authRoutes    = require('./routes/auth');
const partsRoutes   = require('./routes/parts');
const barcodeRoutes = require('./routes/barcodes');
const jobsRoutes    = require('./routes/jobs');

const app = express();

// ─── CORS FIX FOR DEPLOYED FRONTEND ────────────────────────
app.use(cors({
  origin: 'https://pipetrack.onrender.com', // your frontend on Render
  credentials: true, // required to send cookies
}));

// ─── MIDDLEWARE ─────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ─── ROUTES ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/barcodes', barcodeRoutes);
app.use('/api/jobs', jobsRoutes);

// ─── ROOT TEST ROUTE ────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('🚀 PipeTrack backend is running in production!');
});

// ─── DATABASE & SERVER START ────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
