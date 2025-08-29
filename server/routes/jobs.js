const express = require('express');
const Job  = require('../models/Job');   
const Part = require('../models/part');  
const router = express.Router();


// GET /api/jobs — list all jobs
router.get('/', async (req, res) => {
  try {
    const Jobs = await Job.find()
      .populate('partsUsed.part', 'name sku') // include part details
      .sort('-createdAt');
    res.json(Jobs);
  } catch (err) {
    console.error('Jobs fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/jobs — create a new job
router.post('/', async (req, res) => {
  try {
    const { customerName, vanId, partsUsed } = req.body;
    if (!customerName || !vanId || !Array.isArray(partsUsed) || partsUsed.length === 0) {
      return res.status(400).json({ message: 'Missing job details or parts' });
    }

    // Build line items and calculate totals
    let totalCost = 0;
    const items = await Promise.all(partsUsed.map(async item => {
      const part = await Part.findById(item.part);
      if (!part) throw new Error(`Part not found: ${item.part}`);
      const unitPrice = part.price;
      const lineTotal = unitPrice * item.quantity;
      totalCost += lineTotal;
      return {
        part: part._id,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      };
    }));

    const job = new Job({ customerName, vanId, partsUsed: items, totalCost });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error('Job creation error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;
