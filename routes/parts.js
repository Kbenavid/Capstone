const express = require('express');
// Create a router object to define route handlers
const router = express.Router();

// Import the Part model to interact with the parts collection in MongoDB
const Part = require('../models/Part');

// GET all parts
router.get('/', async (req, res) => {
  try {
    // Retrieve all parts from the database
    const parts = await Part.find();
    // Send the list of parts as JSON response
    res.json(parts);
  } catch (err) {
    // If there's an error, respond with HTTP 500 and the error message
    res.status(500).json({ message: err.message });
  }
});

// GET a single part by its ID
router.get('/:id', async (req, res) => {
  try {
    // Find part by ID from URL parameter
    const part = await Part.findById(req.params.id);
    if (!part) {
      // If no part found, respond with 404 Not Found
      return res.status(404).json({ message: 'Part not found' });
    }
    // Send the found part as JSON response
    res.json(part);
  } catch (err) {
    // If error (e.g., invalid ID format), respond with 500 and error message
    res.status(500).json({ message: err.message });
  }
});

// POST create a new part
router.post('/', async (req, res) => {
  // Destructure fields from the request body
  const { name, quantity, price, barcode } = req.body;

  // Create a new Part instance with provided data
  const part = new Part({ name, quantity, price, barcode });

  try {
    // Save the new part to the database
    const newPart = await part.save();
    // Respond with status 201 Created and the saved part data
    res.status(201).json(newPart);
  } catch (err) {
    // If validation or other error, respond with 400 Bad Request and error message
    res.status(400).json({ message: err.message });
  }
});

// PATCH update an existing part by ID
router.patch('/:id', async (req, res) => {
  try {
    // Find the part by ID
    const part = await Part.findById(req.params.id);
    if (!part) {
      // If not found, respond 404
      return res.status(404).json({ message: 'Part not found' });
    }

    // Update the part fields with the data sent in request body
    Object.assign(part, req.body);

    // Save the updated part back to the database
    const updatedPart = await part.save();

    // Send the updated part as response
    res.json(updatedPart);
  } catch (err) {
    // On error, send 400 and error message
    res.status(400).json({ message: err.message });
  }
});

// DELETE a part by ID
router.delete('/:id', async (req, res) => {
  try {
    // Find the part by ID
    const part = await Part.findById(req.params.id);
    if (!part) {
      // If not found, respond 404
      return res.status(404).json({ message: 'Part not found' });
    }

    // Remove the part from the database
    await part.remove();

    // Send confirmation message
    res.json({ message: 'Part deleted' });
  } catch (err) {
    // On error, respond 500 with error message
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
