const User = require('../models/User');
const { createResetToken, hashToken } = require('../utils/resetToken');

// READ THESE ENV VARS:
// DEMO_MODE=true (so we return the reset link instead of emailing)
// APP_URL=http://localhost:5173 (your frontend base URL for the reset page)
const DEMO_MODE = process.env.DEMO_MODE === 'true';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

// ===== Existing handlers (stubs to avoid breaking imports) =====
// Replace these with your real implementations if you already have them.
exports.register = exports.register || (async (req, res) => {
  return res.status(501).json({ ok: false, error: 'register not implemented here' });
});
exports.login = exports.login || (async (req, res) => {
  return res.status(501).json({ ok: false, error: 'login not implemented here' });
});
exports.logout = exports.logout || (async (req, res) => {
  return res.status(200).json({ ok: true, message: 'logged out' });
});
exports.me = exports.me || (async (req, res) => {
  return res.status(200).json({ ok: true, user: null });
});

// ===== Forgot Password =====
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    // Always return 200 to avoid email enumeration
    const user = email ? await User.findOne({ email }) : null;

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

      // In real email mode, send the resetUrl via email provider here.
    }

    return res.json({ ok: true, message: 'If this email exists, a reset link was generated.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};

// ===== Reset Password =====
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
    user.tokenVersion = (user.tokenVersion || 0) + 1; // optional: invalidate existing JWTs
    await user.save();

    return res.json({ ok: true, message: 'Password updated. You can log in now.' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};