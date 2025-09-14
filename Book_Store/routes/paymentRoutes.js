// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/authMiddleware');

// ✅ إنشاء جلسة دفع
router.post('/create-session', requireAuth, paymentController.createPaymentSession);

// ✅ نجاح الدفع
router.get('/success', paymentController.paymentSuccess);

// ✅ إلغاء الدفع
router.get('/cancel', paymentController.paymentCancel);

// ✅ Webhook للتعامل مع أحداث Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);

module.exports = router; 