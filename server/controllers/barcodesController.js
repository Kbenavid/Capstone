const bwipjs = require('bwip-js');


async function getBarcode(req, res) {
const sku = (req.params && req.params.sku) || '';
if (!sku) return res.status(400).json({ message: 'sku required' });
try {
const png = await bwipjs.toBuffer({
bcid: 'code128',
text: sku,
scale: 3,
height: 10,
includetext: true,
textxalign: 'center',
});
res.set('Content-Type', 'image/png');
return res.end(png);
} catch (e) {
console.error('barcode error:', e);
return res.status(500).json({ message: 'barcode generation failed' });
}
}


module.exports = { getBarcode };