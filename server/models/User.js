const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Keep username if you already use it elsewhere (optional)
    username: { type: String, trim: true, unique: true, sparse: true },

    // Email-based login (recommended for forgot-password)
    email: {
      type: String,
      required: false,
      index: { unique: true, sparse: true },
    },

    passwordHash: { type: String, required: true },

    // Password reset support
    tokenVersion: { type: Number, default: 0 },       // bump on password reset to invalidate old JWTs
    resetPasswordTokenHash: { type: String },         // store only the SHA-256 hash
    resetPasswordExpiresAt: { type: Date },           // reset token expiry
  },
  { timestamps: true }
);

// Helpers
userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};
userSchema.methods.validatePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Avoid OverwriteModelError in tests/watch mode
module.exports = mongoose.models.User || mongoose.model('User', userSchema);