const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const router         = express.Router();
const JWT_SECRET     = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';

// ─── REGISTER ───────────────────────────────────────────────────────────
// POST /api/auth/register
router.post('/register', async (req, res) => {
  console.log('📥 Register payload:', req.body);
  const { username, password } = req.body || {};

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const user = new User({ username });
    await user.setPassword(password);
    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('🔴 Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ─── LOGIN ──────────────────────────────────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
  console.log('📥 Login payload:', req.body);
  const { username, password } = req.body || {};

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set JWT in secure, httpOnly cookie
    res
      .cookie('token', token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge:   1000 * 60 * 60, // 1 hour
      })
      .json({ message: 'Login successful' });
  } catch (error) {
    console.error('🔴 Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ─── LOGOUT ─────────────────────────────────────────────────────────────
// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .json({ message: 'Logged out successfully' });
});

module.exports = router;
