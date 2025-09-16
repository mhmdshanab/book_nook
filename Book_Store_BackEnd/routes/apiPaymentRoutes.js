const express = require('express');
const router = express.Router();
const payment = require('../controllers/paymentController');
const { requireAuthApi } = require('../middleware/authMiddleware');

router.post('/create-session', requireAuthApi, payment.apiCreatePaymentSession);

module.exports = router;


