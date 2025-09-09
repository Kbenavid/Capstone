const jwt = require('jsonwebtoken');
const User = require('../models/User');


async function login(req, res) {
const body = req.body || {};
const username = typeof body.username === 'string' ? body.username : '';
const password = typeof body.password === 'string' ? body.password : '';
try {
const user = await User.findOne({ username });
if (!user || !(await user.validatePassword(password))) {
return res.status(400).json({ message: 'Invalid credentials' });
}
const token = jwt.sign(
{ userId: user._id, username: user.username },
process.env.JWT_SECRET,
{ expiresIn: '1h' }
);
res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 3600_000 });
return res.json({ message: 'Logged in' });
} catch (err) {
console.error('login error:', err);
return res.status(500).json({ message: 'Server error' });
}
}


async function logout(req, res) {
res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
return res.json({ message: 'Logged out' });
}


module.exports = { login, logout };