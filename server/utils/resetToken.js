const crypto = require('crypto');

function createResetToken() {
  const raw = crypto.randomBytes(32).toString('hex');                  // send to user (demo response)
  const hash = crypto.createHash('sha256').update(raw).digest('hex');  // store only the hash
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);             // 15 minutes
  return { raw, hash, expiresAt };
}

function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

module.exports = { createResetToken, hashToken };