const express = require('express');
const Part    = require('../models/Part');
const router  = express.Router();

// ─── List all parts ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const parts = await Part.find().sort('name');
    res.json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Create a new part ──────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, sku, quantity, price, restockThreshold } = req.body;
    if (await Part.findOne({ sku })) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    const part = new Part({ name, sku, quantity, price, restockThreshold });
    await part.save();
    res.status(201).json(part);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Update part by ID ──────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const part = await Part.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!part) return res.status(404).json({ message: 'Part not found' });
    res.json(part);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Delete part by ID ──────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const part = await Part.findByIdAndDelete(req.params.id);
    if (!part) return res.status(404).json({ message: 'Part not found' });
    res.json({ message: 'Part deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
