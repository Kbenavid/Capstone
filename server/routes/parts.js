const express = require('express');
const path = require('path');
let Part;
try {
Part = require('../models/part'); // expected when models live under server/models
} catch (e1) {
try {
Part = require(path.join(__dirname, '..', '..', 'models', 'part')); // fallback if models are at repo root
console.log('[parts] using fallback require ../../models/part');
} catch (e2) {
console.error('[parts] could not require Part model from either path', e1, e2);
throw e2;
}
}


const router = express.Router();


// Create a part
router.post('/', async (req, res, next) => {
try {
const { name, sku, quantity = 0, price = 0, restockThreshold = 0 } = req.body || {};


if (!name || !sku) return res.status(400).json({ message: 'name and sku are required' });


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
} catch (err) { next(err); }
});


module.exports = router;