const express = require('express');
const ctrl = require('../controllers/authController');

const router = express.Router();

// Existing auth endpoints (keep your real ones if already implemented)
router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/logout', ctrl.logout);
router.get('/me', ctrl.me);

// Forgot/reset endpoints
router.post('/forgot', ctrl.forgotPassword);
router.post('/reset', ctrl.resetPassword);

module.exports = router;