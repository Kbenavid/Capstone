const mongoose = require('mongoose');
const { Schema } = mongoose;

const PartSchema = new Schema(
  {
    name:   { type: String, required: true, trim: true },
    sku:    { type: String, required: true, unique: true, trim: true },

    // Optional; generated when missing. Keep undefined (not null) if absent.
    barcode: { type: String, trim: true, default: undefined },

    quantity:         { type: Number, default: 0, min: 0 },
    price:            { type: Number, default: 0, min: 0 },
    restockThreshold: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Unique indexes
PartSchema.index({ sku: 1 }, { unique: true });

// Only enforce uniqueness when barcode exists (string)
PartSchema.index(
  { barcode: 1 },
  { unique: true, partialFilterExpression: { barcode: { $type: 'string' } } }
);

module.exports = mongoose.model('Part', PartSchema);