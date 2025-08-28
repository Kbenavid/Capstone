const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.set('trust proxy', 1); // Required for Render + Secure Cookies

// ─── MIDDLEWARE ─────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ─── CORS SETUP FOR RENDER DEPLOYMENT ──────────────────────
app.use(cors({
  origin: 'https://pipetrack.onrender.com', // Frontend on Render
  credentials: true,
}));

// ─── ROUTES ─────────────────────────────────────────────────
const authRoutes     = require('./routes/auth');
const partsRoutes    = require('./routes/parts');
const barcodesRoutes = require('./routes/barcodes');
const jobsRoutes     = require('./routes/jobs');

// Use only relative paths, not full URLs
app.use('/api/auth', authRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/barcodes', barcodesRoutes);
app.use('/api/jobs', jobsRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

// ─── ROOT ROUTE ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('🚀 PipeTrack backend is running in production!');
});

// ─── DATABASE CONNECT ───────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ─── START SERVER ───────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
