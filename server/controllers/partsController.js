const mongoose = require('mongoose');
const Part     = require('../models/part');           // ensure filename is server/models/part.js (lowercase)
const { nextPartBarcode } = require('../utils/barcode');

// Helpers
function toStr(v) { return (v ?? '').toString().trim(); }
function toNum(v, d = 0) { const n = Number(v); return Number.isFinite(n) ? n : d; }
function isId(v) { return mongoose.isValidObjectId(v); }

// GET /api/parts
async function listParts(_req, res, next) {
  try {
    const out = await Part.find({}).sort({ createdAt: -1 });
    return res.json(out);
  } catch (err) {
    next(err);
  }
}

// POST /api/parts
async function createPart(req, res, next) {
  try {
    const name   = toStr(req.body?.name);
    const sku    = toStr(req.body?.sku);
    if (!name || !sku) return res.status(400).json({ message: 'name and sku are required' });

    const payload = {
      name,
      sku,
      quantity:        toNum(req.body?.quantity, 0),
      price:           toNum(req.body?.price, 0),
      restockThreshold:toNum(req.body?.restockThreshold, 0),
    };

    // Use provided barcode or auto-generate
    const bc = toStr(req.body?.barcode);
    payload.barcode = bc || await nextPartBarcode();

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
    console.error('createPart error:', err);
    next(err);
  }
}

// PUT /api/parts/:id
async function updatePart(req, res, next) {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: 'invalid id' });

    const update = {};
    if (req.body?.name   !== undefined) update.name   = toStr(req.body.name);
    if (req.body?.sku    !== undefined) update.sku    = toStr(req.body.sku);
    if (req.body?.quantity !== undefined) update.quantity = toNum(req.body.quantity, 0);
    if (req.body?.price    !== undefined) update.price    = toNum(req.body.price, 0);
    if (req.body?.restockThreshold !== undefined) update.restockThreshold = toNum(req.body.restockThreshold, 0);
    if (req.body?.barcode !== undefined) {
      const bc = toStr(req.body.barcode);
      update.barcode = bc || undefined; // unset if empty
    }

    const saved = await Part.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true, context: 'query' }
    );
    if (!saved) return res.status(404).json({ message: 'not found' });
    return res.json(saved);
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
    console.error('updatePart error:', err);
    next(err);
  }
}

// DELETE /api/parts/:id
async function deletePart(req, res, next) {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: 'invalid id' });

    const out = await Part.findByIdAndDelete(id);
    if (!out) return res.status(404).json({ message: 'not found' });
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { listParts, createPart, updatePart, deletePart };
