jest.mock('../models/part', () => ({
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    }));
    jest.mock('../utils/barcode', () => ({ nextPartBarcode: jest.fn().mockResolvedValue('PT000123') }));
    
    
    const Part = require('../models/part');
    const { nextPartBarcode } = require('../utils/barcode');
    const { makeRes } = require('./helpers/mockRes');
    const { listParts, createPart, updatePart, deletePart } = require('../controllers/partsController');
    
    
    beforeEach(() => { jest.clearAllMocks(); });
    
    
    const reqP = (body = {}, params = {}) => ({ body, params });
    
    
    // list
    test('listParts returns array', async () => {
    Part.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ name: 'A' }]) });
    const res = makeRes();
    await listParts({}, res, () => {});
    expect(res.json).toHaveBeenCalledWith([{ name: 'A' }]);
    });
    
    
    // create
    test('createPart auto barcode', async () => {
    Part.create.mockResolvedValue({ _id: 'p1', name: 'Pipe', sku: 'P-1', barcode: 'PT000123' });
    const res = makeRes();
    await createPart(reqP({ name: 'Pipe', sku: 'P-1' }), res, () => {});
    expect(nextPartBarcode).toHaveBeenCalled();
    expect(Part.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    });
    
    
    test('createPart duplicate -> 409', async () => {
    const err = new Error('dup'); err.code = 11000; err.keyValue = { sku: 'X' };
    Part.create.mockRejectedValue(err);
    const res = makeRes();
    await createPart(reqP({ name: 'X', sku: 'X' }), res, () => {});
    expect(res.status).toHaveBeenCalledWith(409);
    });
    
    
    // update
    test('updatePart invalid id -> 400', async () => {
    const res = makeRes();
    await updatePart(reqP({ price: 9 }, { id: 'notanid' }), res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
    });
    
    
    test('updatePart ok', async () => {
    const id = '507f1f77bcf86cd799439011';
    Part.findByIdAndUpdate.mockResolvedValue({ _id: id, name: 'Valve', price: 9 });
    const res = makeRes();
    await updatePart(reqP({ price: 9 }, { id }), res, () => {});
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: id, price: 9 }));
    });
    
    
    // delete
    test('deletePart not found -> 404', async () => {
    const id = '507f1f77bcf86cd799439012';
    Part.findByIdAndDelete.mockResolvedValue(null);
    const res = makeRes();
    await deletePart(reqP({}, { id }), res, () => {});
    expect(res.status).toHaveBeenCalledWith(404);
    });
    
    
    test('deletePart ok -> 204', async () => {
    const id = '507f1f77bcf86cd799439013';
    });