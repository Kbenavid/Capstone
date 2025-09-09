const mongoose = require('mongoose');
quantity: toNum(req.body && req.body.quantity, 0),
price: toNum(req.body && req.body.price, 0),
restockThreshold: toNum(req.body && req.body.restockThreshold, 0),
};


const bc = toStr(req.body && req.body.barcode);
payload.barcode = bc || (await nextPartBarcode());


const created = await Part.create(payload);
return res.status(201).json(created);
} catch (err) {
if (err && err.code === 11000) {
const kv = err.keyValue || {};
return res.status(409).json({ message: 'Duplicate: ' + Object.entries(kv).map(([k,v])=>`${k}=${v}`).join(', '), keyValue: kv });
}
if (err && err.name === 'ValidationError') return res.status(400).json({ message: err.message });
return next(err);
}
}


async function updatePart(req, res, next) {
try {
const id = req.params.id;
if (!isId(id)) return res.status(400).json({ message: 'invalid id' });
const up = {};
const b = req.body || {};
if (Object.prototype.hasOwnProperty.call(b, 'name')) up.name = toStr(b.name);
if (Object.prototype.hasOwnProperty.call(b, 'sku')) up.sku = toStr(b.sku);
if (Object.prototype.hasOwnProperty.call(b, 'quantity')) up.quantity = toNum(b.quantity, 0);
if (Object.prototype.hasOwnProperty.call(b, 'price')) up.price = toNum(b.price, 0);
if (Object.prototype.hasOwnProperty.call(b, 'restockThreshold')) up.restockThreshold = toNum(b.restockThreshold, 0);
if (Object.prototype.hasOwnProperty.call(b, 'barcode')) {
const bc = toStr(b.barcode);
up.barcode = bc || undefined; // unset when empty
}
const saved = await Part.findByIdAndUpdate(id, up, { new: true, runValidators: true, context: 'query' });
if (!saved) return res.status(404).json({ message: 'not found' });
return res.json(saved);
} catch (err) {
if (err && err.code === 11000) {
const kv = err.keyValue || {};
return res.status(409).json({ message: 'Duplicate: ' + Object.entries(kv).map(([k,v])=>`${k}=${v}`).join(', '), keyValue: kv });
}
if (err && err.name === 'ValidationError') return res.status(400).json({ message: err.message });
return next(err);
}
}


async function deletePart(req, res, next) {
try {
const id = req.params.id;
if (!isId(id)) return res.status(400).json({ message: 'invalid id' });
const out = await Part.findByIdAndDelete(id);
if (!out) return res.status(404).json({ message: 'not found' });
return res.status(204).end();
} catch (err) { return next(err); }
}


module.exports = { listParts, createPart, updatePart, deletePart };