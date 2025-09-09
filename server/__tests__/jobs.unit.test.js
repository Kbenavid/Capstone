jest.mock('../models/Job', () => ({ find: jest.fn(), create: jest.fn() }));
const Job = require('../models/Job');
const { makeRes } = require('./helpers/mockRes');
const { listJobs, createJob } = require('../controllers/jobsController');


beforeEach(() => { jest.clearAllMocks(); });


const reqJ = (body = {}) => ({ body });


test('listJobs returns array', async () => {
Job.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ id: 'j1' }]) });
const res = makeRes();
await listJobs({}, res, () => {});
expect(res.json).toHaveBeenCalledWith([{ id: 'j1' }]);
});


test('createJob ok -> 201', async () => {
Job.create.mockResolvedValue({ id: 'j2' });
const res = makeRes();
await createJob(reqJ({ name: 'Install' }), res, () => {});
expect(res.status).toHaveBeenCalledWith(201);
});