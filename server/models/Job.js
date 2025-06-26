const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  customerName:   { type: String, required: true },
  vanId:          { type: String, required: true }, // e.g. “Van 1”
  partsUsed: [{
    part:       { type: mongoose.Schema.Types.ObjectId, ref: 'Part', required: true },
    quantity:   { type: Number, default: 1, min: 1 },
    unitPrice:  { type: Number, required: true }, // snapshot of part.price
    lineTotal:  { type: Number, required: true }, // quantity * unitPrice
  }],
  totalCost:      { type: Number, required: true }, // sum of all lineTotals
  jobDate:        { type: Date, default: Date.now },
}, {
  timestamps: true, // createdAt & updatedAt
});

module.exports = mongoose.model('Job', jobSchema);
