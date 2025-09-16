const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { requireAuthApi } = require('../middleware/authMiddleware');

router.post('/register', auth.apiRegister);
router.post('/login', auth.apiLogin);
router.post('/logout', auth.apiLogout);
router.get('/me', requireAuthApi, auth.apiMe);

module.exports = router;


