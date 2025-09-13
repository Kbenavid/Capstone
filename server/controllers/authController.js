const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

function toStr(v) { return (v ?? '').toString().trim(); }

// ---- Register ------------------------------------------------------------
async function register(req, res) {
  try {
    const username = toStr(req.body?.username);
    const password = toStr(req.body?.password);
    const emailRaw = toStr(req.body?.email);
    const email = emailRaw ? emailRaw.toLowerCase() : undefined;

    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }

    const dupQuery = email ? { $or: [{ username }, { email }] } : { username };
    const existing = await User.findOne(dupQuery);
    if (existing) return res.status(409).json({ message: 'user already exists' });

    const user = new User({ username, email });
    if (typeof user.setPassword === 'function') {
      await user.setPassword(password);
    } else {
      user.passwordHash = await bcrypt.hash(password, 10);
    }
    await user.save();

    return res.status(201).json({ message: 'Registered' });
  } catch (err) {
    console.error('register error:', err);
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Server error' });
  }
}

// ---- Login ---------------------------------------------------------------
async function login(req, res) {
  try {
    const username = toStr(req.body?.username);
    const password = toStr(req.body?.password);

    const user = await User.findOne({ username });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure:   true,
      sameSite: 'none',
      maxAge:   3600 * 1000,
    });

    return res.json({ message: 'Logged in' });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ---- Logout --------------------------------------------------------------
async function logout(_req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure:   true,
    sameSite: 'none',
  });
  return res.json({ message: 'Logged out' });
}

// ---- Me ------------------------------------------------------------------
async function me(req, res) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ userId: payload.userId, username: payload.username });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { register, login, logout, me };
