const Counter = require('../models/Counter');

function formatBarcode(n) {
  // PT + 6-digit zero-padded sequence (e.g., PT000001)
  return `PT${String(n).padStart(6, '0')}`;
}

async function nextPartBarcode() {
  const doc = await Counter.findOneAndUpdate(
    { _id: 'parts_barcode' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return formatBarcode(doc.seq);
}

module.exports = { nextPartBarcode, formatBarcode };
