const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  price: {
    type: Number,
    default: 0,
    min: 0,
  },
  restockThreshold: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,  // adds createdAt and updatedAt
});

module.exports = mongoose.model('Part', partSchema);
