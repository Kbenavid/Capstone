// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes    = require('./routes/auth');
const partsRoutes   = require('./routes/parts');
const barcodesRoutes= require('./routes/barcodes');
const jobsRoutes    = require('./routes/jobs');

const app = express();

// Allow your Render frontend and credentials:
app.use(cors({
  origin: 'https://pipetrack.onrender.com',  // your live frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth',    authRoutes);
app.use('/api/parts',   partsRoutes);
app.use('/api/barcodes',barcodesRoutes);
app.use('/api/jobs',    jobsRoutes);

// DB + start
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
