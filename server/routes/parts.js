const express = require('express');
const Part = require('../models/part');
const { nextPartBarcode } = require('../utils/barcode');
const bc = typeof barcode === 'string' ? barcode.trim() : '';
payload.barcode = bc || (await nextPartBarcode());
const router = express.Router();

// Create a part
router.post('/', async (req, res, next) => {
  try {
    const { name, sku } = req.body || {};
    let { quantity = 0, price = 0, restockThreshold = 0, barcode } = req.body || {};

    if (!name || !sku) return res.status(400).json({ message: 'name and sku are required' });

    const payload = {
      name: String(name).trim(),
      sku: String(sku).trim(),
      quantity: Number(quantity) || 0,
      price: Number(price) || 0,
      restockThreshold: Number(restockThreshold) || 0,
    };

    // Only save barcode if present; otherwise generate a new one
    const bc = typeof barcode === 'string' ? barcode.trim() : '';
    payload.barcode = bc || (await nextPartBarcode());

    console.log('[parts.create] about to save:', payload);
 
    const created = await Part.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    if (err?.code === 11000) {
      const kv = err.keyValue || {};
      return res.status(409).json({
        message: `Duplicate: ${Object.entries(kv).map(([k, v]) => `${k}=${v}`).join(', ')}`,
        keyValue: kv,
      });
    }
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error('Create part error:', err);
    next(err);
  }
});


module.exports = router;