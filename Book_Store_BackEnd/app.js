// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

// 🔗 Import Routes
const paymentRoutes = require('./routes/paymentRoutes');
const authMiddleware = require('./middleware/authMiddleware')
// 🔌 Connect to DB
const connectDB = require('./config/db');
connectDB();

const app = express();

// 🔧 Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// 🌐 CORS for frontend (supports multiple comma-separated origins)
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server or curl
    const isAllowed = FRONTEND_ORIGINS.some((allowed) => allowed === origin);
    return callback(null, isAllowed ? origin : false);
  },
  credentials: true,
}));

// Middleware خاص لـ Stripe webhook
app.use('/payment/webhook', express.raw({ type: 'application/json' }));
app.use(bodyParser.json());

// خدمة الملفات الثابتة للصور
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// (View engine removed — API only)
// Remove unused views/public folders from app config

// (setUser removed — not needed for API only)

// 📦 Legacy view routes removed; keep payment for webhook/success/cancel
app.use('/payment', paymentRoutes);

// ======= API (JSON) =======
const apiAuth = require('./routes/apiAuthRoutes');
const apiBooks = require('./routes/apiBookRoutes');
const apiCart = require('./routes/apiCartRoutes');
const apiPayment = require('./routes/apiPaymentRoutes');
const { requireAuthApi } = require('./middleware/authMiddleware');

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});
// توافق مع سكربت الفحص القديم
app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

app.use('/api/auth', apiAuth);
app.use('/api/books', apiBooks);
app.use('/api/cart', apiCart);
app.use('/api/payment', apiPayment);

// 🚀 Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
