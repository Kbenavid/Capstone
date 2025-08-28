const express = require('express');
const Part = require('../models/part'); 
const router = express.Router();

// Create a part
router.post('/', async (req, res, next) => {
  try {
    const { name, sku, quantity = 0, price = 0, restockThreshold = 0 } = req.body || {};

    // Basic validation
    if (!name || !sku) {
      return res.status(400).json({ message: 'name and sku are required' });
    }

    // Cast numbers (frontends often send strings)
    const payload = {
      name: String(name).trim(),
      sku: String(sku).trim(),
      quantity: Number(quantity) || 0,
      price: Number(price) || 0,
      restockThreshold: Number(restockThreshold) || 0,
    };

    const part = await Part.create(payload);
    return res.status(201).json(part);
  } catch (err) {
    // Duplicate key (e.g., unique SKU)
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'SKU already exists' });
    }
    // Mongoose validation errors
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error('Create part error:', err); // ⬅️ will show in Render logs
    return next(err); // let global handler format as 500
  }
});

// (Optional) list parts — keep your existing GET if you already have one
router.get('/', async (req, res, next) => {
  try {
    const parts = await Part.find().sort({ createdAt: -1 });
    res.json(parts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
