const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

// ─── CORS SETUP ─────────────────────────────────────────────
app.use(cors({
  origin: 'https://pipetrack.onrender.com',
  credentials: true,
}));

// Manually handle preflight requests
app.options('*', cors({
  origin: 'https://pipetrack.onrender.com',
  credentials: true,
}));

// ─── MIDDLEWARE ─────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ─── ROUTES ─────────────────────────────────────────────────
const authRoutes    = require('./routes/auth');
const partsRoutes   = require('./routes/parts');
const barcodeRoutes = require('./routes/barcodes');
const jobsRoutes    = require('./routes/jobs');

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
