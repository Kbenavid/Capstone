const mongoose = require('mongoose');
const { Schema } = mongoose;

const PartSchema = new Schema({
  name:   { type: String, required: true, trim: true },
  sku:    { type: String, required: true, unique: true, trim: true },
  quantity:         { type: Number, default: 0, min: 0 },
  price:            { type: Number, default: 0, min: 0 },
  restockThreshold: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

PartSchema.index({ sku: 1 }, { unique: true });

module.exports = mongoose.model('Part', PartSchema);
