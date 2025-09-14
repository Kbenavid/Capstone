const express = require('express');
const ctrl = require('../controllers/authController');
const requireAuth = require('../middlewares/requireAuth'); // <-- this path is correct from routes/

const router = express.Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/logout', ctrl.logout);

// Protect /me so it returns 401 when not logged in
router.get('/me', requireAuth, ctrl.me);

router.post('/forgot', ctrl.forgotPassword);
router.post('/reset', ctrl.resetPassword);

module.exports = router;