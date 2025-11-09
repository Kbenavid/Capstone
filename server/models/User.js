const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true,   
    },

    email: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true,   
    },

    passwordHash: { type: String, required: true },

    tokenVersion: { type: Number, default: 0 },
    resetPasswordTokenHash: { type: String },
    resetPasswordExpiresAt: { type: Date },
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