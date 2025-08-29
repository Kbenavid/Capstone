const express = require('express');
const Part = require('../models/part'); // matches server/models/part.js
const router = express.Router();

// Create a part
router.post('/', async (req, res, next) => {
  try {
    const { name, sku, quantity = 0, price = 0, restockThreshold = 0 } = req.body || {};

    if (!name || !sku) {
      return res.status(400).json({ message: 'name and sku are required' });
    }

    const payload = {
      name: String(name).trim(),
      sku: String(sku).trim(),
      quantity: Number(quantity) || 0,
      price: Number(price) || 0,
      restockThreshold: Number(restockThreshold) || 0,
    };

    const created = await Part.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ message: 'SKU already exists' });
    if (err?.name === 'ValidationError') return res.status(400).json({ message: err.message });
    console.error('Create part error:', err);
    return next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const parts = await Part.find().sort({ createdAt: -1 });
    res.json(parts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
