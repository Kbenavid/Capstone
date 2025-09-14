const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function requireAuth(req, res, next) {
  try {
    // Grab token from Authorization or cookie
    let token = null;
    const auth = req.headers.authorization || '';
    if (auth.startsWith('Bearer ')) token = auth.slice(7);
    if (!token && req.cookies && req.cookies.token) token = req.cookies.token;

    if (!token) return res.status(401).json({ ok:false, error:'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).lean();
    if (!user) return res.status(401).json({ ok:false, error:'Unauthorized' });

    if (decoded.tv !== undefined && user.tokenVersion !== undefined && decoded.tv !== user.tokenVersion) {
      return res.status(401).json({ ok:false, error:'Session expired' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ ok:false, error:'Unauthorized' });
  }
};