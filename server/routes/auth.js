const express  = require('express');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const router   = express.Router();

// ... register unchanged ...

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 1) Sign the JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    // 2) Set it on an httpOnly, secure cookie for your front-end domain
    res.cookie('token', token, {
      httpOnly: true,
      secure:   true,                  // only over HTTPS
      sameSite: 'none',                // allow cross-site
      maxAge:   3600 * 1000,           // 1 hour in ms
    });

    // 3) Send success
    res.json({ message: 'Logged in' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Implement logout to clear the cookie:
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure:   true,
    sameSite: 'none',
  });
  res.json({ message: 'Logged out' });
});

router.get('/me', (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ userId: payload.userId, username: payload.username });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
