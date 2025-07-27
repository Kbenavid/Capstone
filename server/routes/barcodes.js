const express = require('express');
const bwipjs = require('bwip-js');
const router = express.Router();

// Define a GET route that includes a named param in a more specific path
router.get('/generate/:code', (req, res) => {
  const code = req.params.code;

  bwipjs.toBuffer({
    bcid: 'code128',
    text: code,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: 'center',
  }, (err, png) => {
    if (err) {
      res.status(400).send('Error generating barcode');
    } else {
      res.type('png');
      res.send(png);
    }
  });
});

module.exports = router;
