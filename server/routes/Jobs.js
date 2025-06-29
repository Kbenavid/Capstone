const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Part = require('../models/Part');
const jsPDF = require('jspdf');

// @desc    Create a new job and update inventory
// @route   POST /api/jobs
router.post('/', async (req, res) => {
  try {
    const { customerName, vanId, partsUsed } = req.body;

    // Update inventory quantities
    for (const item of partsUsed) {
      const part = await Part.findById(item.part);
      if (!part) return res.status(404).json({ message: `Part ${item.part} not found` });

      part.quantity -= item.quantity;
      await part.save();
    }

    const job = new Job({ customerName, vanId, partsUsed });
    await job.save();

    res.status(201).json({ message: 'Job recorded', job });
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(500).json({ message: 'Server error while creating job' });
  }
});

// @desc    Get all jobs
// @route   GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('partsUsed.part');
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
});

// @desc    Generate invoice PDF for a job
// @route   GET /api/jobs/:id/invoice
router.get('/:id/invoice', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('partsUsed.part');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Invoice for ${job.customerName}`, 20, 20);
    doc.text(`Van ID: ${job.vanId}`, 20, 30);

    let y = 50;
    let total = 0;

    doc.setFontSize(12);
    job.partsUsed.forEach(item => {
      const line = `${item.part.name} — ${item.quantity} × $${item.part.price.toFixed(2)} = $${(item.quantity * item.part.price).toFixed(2)}`;
      total += item.quantity * item.part.price;
      doc.text(line, 20, y);
      y += 10;
    });

    doc.text(`Total: $${total.toFixed(2)}`, 20, y + 10);

    const pdf = doc.output();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdf, 'binary'));
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Server error while generating invoice' });
  }
});

module.exports = router;
