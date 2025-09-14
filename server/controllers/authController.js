// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createResetToken, hashToken } = require('../utils/resetToken');

// Env
const DEMO_MODE = process.env.DEMO_MODE === 'true';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;

// Cookie options for Render/HTTPS
const cookieOpts = {
  httpOnly: true,
  secure: true,      // Render is HTTPS
  sameSite: 'None',  // cross-site from frontend -> backend
  path: '/',
};

// ---------- Helpers ----------
function issueJwt(user) {
  const payload = { sub: user._id.toString(), tv: user.tokenVersion || 0 };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function setAuthCookie(res, token) {
  res.cookie('token', token, COOKIE_DOMAIN ? { ...cookieOpts, domain: COOKIE_DOMAIN } : cookieOpts);
}

// ---------- Controllers ----------

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    let { email, password, username } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: 'Email and password are required.' });
    }
    email = String(email).toLowerCase().trim();
    if (username) username = String(username).trim();

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ ok: false, error: 'Email already in use.' });

    const user = new User({ email, username: username || undefined });
    await user.setPassword(password);
    await user.save();

    // Auto-login on register (optional; keeps UX smooth)
    const token = issueJwt(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      ok: true,
      user: { id: user._id, email: user.email, username: user.username || null },
    });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};

// POST /api/auth/login
// Body: { identifier: "<email or username>", password: "<pw>" }
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res.status(400).json({ ok: false, error: 'Missing credentials' });
    }

    const isEmail = String(identifier).includes('@');
    const query = isEmail
      ? { email: String(identifier).toLowerCase().trim() }
      : { username: String(identifier).trim() };

    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ ok: false, error: 'Invalid credentials' });

    const valid = await user.validatePassword(password);
    if (!valid) return res.status(401).json({ ok: false, error: 'Invalid credentials' });

    const token = issueJwt(user);
    setAuthCookie(res, token);

    return res.json({
      ok: true,
      user: { id: user._id, email: user.email, username: user.username || null },
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    const opts = COOKIE_DOMAIN ? { ...cookieOpts, domain: COOKIE_DOMAIN } : cookieOpts;
    res.clearCookie('token', opts);
    return res.json({ ok: true });
  } catch (err) {
    console.error('logout error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};

// GET /api/auth/me (protected with requireAuth)
exports.me = async (req, res) => {
  const { _id, email, username } = req.user || {};
  if (!_id) return res.status(401).json({ ok: false, error: 'Unauthorized' });
  return res.json({ ok: true, user: { id: _id, email, username } });
};

// POST /api/auth/forgot
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    const user = email ? await User.findOne({ email: String(email).toLowerCase().trim() }) : null;

    // Always respond 200 to avoid email enumeration
    if (user) {
      const { raw, hash, expiresAt } = createResetToken();
      user.resetPasswordTokenHash = hash;
      user.resetPasswordExpiresAt = expiresAt;
      await user.save();

      const resetUrl = `${APP_URL}/reset-password?token=${raw}`;

      if (DEMO_MODE) {
        console.log('[DEMO] Password reset URL:', resetUrl);
        return res.json({
          ok: true,
          message: 'If this email exists, a reset link was generated.',
          demoResetUrl: resetUrl,
          expiresAt,
        });
      }

      // In non-demo mode, send resetUrl via email provider
    }

    return res.json({ ok: true, message: 'If this email exists, a reset link was generated.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};

// POST /api/auth/reset
// Body: { token, newPassword }
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) {
      return res.status(400).json({ ok: false, error: 'Missing token or newPassword' });
    }

    const tokenHash = hashToken(token);
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ ok: false, error: 'Invalid or expired token' });
    }

    await user.setPassword(newPassword);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1; // invalidate existing JWTs
    await user.save();

    return res.json({ ok: true, message: 'Password updated. You can log in now.' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};