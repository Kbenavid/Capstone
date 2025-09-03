const express = require('express');
const mongoose = require('mongoose');
const Part = require('../models/part'); // match exact filename case
const { nextPartBarcode } = require('../utils/barcode');


const router = express.Router();


// ---------- helpers ----------
const isId = (id) => mongoose.isValidObjectId(id);
const toNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
const toStr = (v) => (typeof v === 'string' ? v.trim() : '');


// ---------- list ----------
router.get('/', async (req, res, next) => {
try {
const parts = await Part.find().sort({ createdAt: -1 });
res.json(parts);
} catch (err) { next(err); }
});


// ---------- create (auto-barcode when missing) ----------
router.post('/', async (req, res, next) => {
try {
const name = toStr(req.body?.name);
const sku = toStr(req.body?.sku);
if (!name || !sku) return res.status(400).json({ message: 'name and sku are required' });


const payload = {
name,
sku,
quantity: toNum(req.body?.quantity, 0),
price: toNum(req.body?.price, 0),
restockThreshold: toNum(req.body?.restockThreshold, 0),
};


const bc = toStr(req.body?.barcode);
payload.barcode = bc || (await nextPartBarcode());


const created = await Part.create(payload);
res.status(201).json(created);
} catch (err) {
if (err?.code === 11000) {
const kv = err.keyValue || {};
return res.status(409).json({ message: `Duplicate: ${Object.entries(kv).map(([k, v]) => `${k}=${v}`).join(', ')}`, keyValue: kv });
}
if (err?.name === 'ValidationError') return res.status(400).json({ message: err.message });
console.error('Create part error:', err);
next(err);
}
});


// ---------- update ----------
router.put('/:id', async (req, res, next) => {
try {
const { id } = req.params;
if (!isId(id)) return res.status(400).json({ message: 'invalid id' });


const update = {};
if (req.body?.name !== undefined) update.name = toStr(req.body.name);
if (req.body?.sku !== undefined) update.sku = toStr(req.body.sku);
if (req.body?.quantity !== undefined) update.quantity = toNum(req.body.quantity, 0);
if (req.body?.price !== undefined) update.price = toNum(req.body.price, 0);
if (req.body?.restockThreshold !== undefined) update.restockThreshold = toNum(req.body.restockThreshold, 0);
if (req.body?.barcode !== undefined) {
const bc = toStr(req.body.barcode);
update.barcode = bc || undefined; // empty string unsets
}


const saved = await Part.findByIdAndUpdate(id, update, { new: true, runValidators: true, context: 'query' });
if (!saved) return res.status(404).json({ message: 'not found' });
res.json(saved);
} catch (err) {
if (err?.code === 11000) {
const kv = err.keyValue || {};
return res.status(409).json({ message: `Duplicate: ${Object.entries(kv).map(([k, v]) => `${k}=${v}`).join(', ')}`, keyValue: kv });
}
if (err?.name === 'ValidationError') return res.status(400).json({ message: err.message });
console.error('Update part error:', err);
next(err);
}
});
// ---------- delete ----------
router.delete('/:id', async (req, res, next) => {
  try {
  const { id } = req.params;
  if (!isId(id)) return res.status(400).json({ message: 'invalid id' });
  
  
  const out = await Part.findByIdAndDelete(id);
  if (!out) return res.status(404).json({ message: 'not found' });
  res.status(204).end();
  } catch (err) { next(err); }
  });
  
  
  module.exports = router;