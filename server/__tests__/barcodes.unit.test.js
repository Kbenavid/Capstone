jest.mock('bwip-js', () => ({ toBuffer: jest.fn().mockResolvedValue(Buffer.from('png')) }));
const bwip = require('bwip-js');
const { makeRes } = require('./helpers/mockRes');
const { getBarcode } = require('../controllers/barcodesController');


const reqB = (params = {}) => ({ params });


beforeEach(() => { jest.clearAllMocks(); });


test('barcode needs sku', async () => {
const res = makeRes();
await getBarcode(reqB({ sku: '' }), res);
expect(res.status).toHaveBeenCalledWith(400);
});


test('barcode ok -> png', async () => {
const res = makeRes();
await getBarcode(reqB({ sku: 'TEST-1' }), res);
expect(bwip.toBuffer).toHaveBeenCalled();
expect(res.headers['content-type']).toMatch('image/png');
expect(res.end).toHaveBeenCalled();
});