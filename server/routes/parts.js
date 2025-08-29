const express = require('express');
const Part = require('../models/part'); 
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
// Duplicate key (unique index on sku)
if (err && err.code === 11000) {
const kv = err.keyValue || {}; // e.g., { sku: '0002' }
return res.status(409).json({
message: `Duplicate: ${Object.entries(kv).map(([k,v]) => `${k}=${v}`).join(', ')}`,
keyValue: kv,
});
}
// Mongoose validation
if (err?.name === 'ValidationError') {
return res.status(400).json({ message: err.message });
}
console.error('Create part error:', err);
return next(err);
}
});


// Check if a SKU exists
router.get('/exists/:sku', async (req, res, next) => {
try {
const sku = String(req.params.sku || '').trim();
const doc = await Part.findOne({ sku });
res.json({ exists: !!doc, sku, id: doc?._id });
} catch (err) {
next(err);
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