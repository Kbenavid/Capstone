const express = require('express'); //import express
const bwipjs = require('bwip-js'); //import bwip-js to generate barcodes
const router = express.Router(); //create a new router instance

//define a GET route tha accepts a 'code' parameter in the URL
router.get('/:code', (req, res) => {
    const code = req.params.code; // Extract the barcode text from the url parameter

    //Generate the barcode as a PNG image
    bwipjs.toBuffer({
        bcid: 'code128', // barcode type
        text: code, // the text to encode into the barcode
        scale: 3, // scale factor for the barcode
        height: 10, // height of the barcode in millimeters
        includetext: true, // incude readable text below the barcode
        textxalign: 'center', // align the text to the center
    }, (err, png) => {
        if (err) {
            // if barcode generation fails, send a 400 error with a message
            res.status(400).send('Error generating barcode');
        } else {
            // if successful, set response type to PNG and send the generated barcode image
            res.type('png');
            res.send(png);
        }
    });
}); 

module.exports = router; // export the router so it can be used in other parts of the application