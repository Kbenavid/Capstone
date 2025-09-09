const Job = require('../models/Job');


async function listJobs(req, res, next) {
try { const rows = await Job.find().sort({ createdAt: -1 }); return res.json(rows); }
catch (e) { return next(e); }
}


async function createJob(req, res, next) {
try {
const created = await Job.create(req.body || {});
return res.status(201).json(created);
} catch (e) {
if (e && e.name === 'ValidationError') return res.status(400).json({ message: e.message });
return next(e);
}
}


module.exports = { listJobs, createJob };