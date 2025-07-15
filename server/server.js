require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Route imports
const authRoutes    = require('./routes/auth');
const partsRoutes   = require('./routes/parts');
const barcodeRoutes = require('./routes/barcodes');
const jobsRoutes    = require('./routes/jobs');

const app = express();

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'https://pipetrack.onrender.com'], // both local + deployed
  credentials: true,
}));

app.use(express.json());       // Parse JSON bodies
app.use(cookieParser());       // Parse cookies

// ─── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/parts',   partsRoutes);
app.use('/api/barcodes', barcodeRoutes);
app.use('/api/jobs',    jobsRoutes);

// ─── ROOT TEST ────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('🚀 PipeTrack backend is running!');
});

// ─── DATABASE & SERVER START ───────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
