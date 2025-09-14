// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { sendEmail } = require('../utils/mailer');
const generateToken = require('../utils/generateToken'); // ✅ استدعاء الدالة الجديدة

// ✅ عرض صفحة تسجيل الدخول (غير مستخدم مع واجهة React)
exports.getLoginPage = (req, res) => {
  res.status(410).send('login page removed in API mode');
};

// ✅ عرض صفحة التسجيل (غير مستخدم مع واجهة React)
exports.getRegisterPage = (req, res) => {
  res.status(410).send('register page removed in API mode');
};

// ✅ معالجة التسجيل (للمسارات القديمة)
exports.postRegister = async (req, res) => {
  const { username, firstName, lastName, email, phone, password, confirmPassword } = req.body;

  if (!username || !firstName || !lastName || !email || !phone || !password || !confirmPassword) {
    res.cookie('message', '❌ All fields are required.');
    return res.redirect('/register');
  }

  if (password !== confirmPassword) {
    res.cookie('message', '❌ Passwords do not match.');
    return res.redirect('/register');
  }

  try {
    const existingUser = await User.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });
    if (existingUser) {
      res.cookie('message', '⚠️ Username already exists.');
      return res.redirect('/register');
    }

    const userCount = await User.countDocuments();
    const isAdmin = userCount === 0;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
  username,
  firstName,
  lastName,
  email,
  phone,
  password: hashedPassword,
  isAdmin
});

await newUser.save(); // ✅ هذا ضروري تنتظره لأنه يعتمد عليه كل شيء بعده

// ✅ إرسال الإيميل بالخلفية بدون انتظار
sendEmail(
  email,
  '📚 Welcome to Book Store!',
  `Hello ${firstName}, thank you for registering!`
).catch(emailErr => {
  console.warn('⚠️ Failed to send welcome email:', emailErr.message);
});
    const token = generateToken(newUser); // ✅ استخدام الدالة الجديدة
    res.cookie('token', token, { httpOnly: true });

    return res.redirect(newUser.isAdmin ? '/dashboard/admin' : '/dashboard/user');

  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).send('❌ Error registering user.');
  }
};

// ✅ تسجيل الدخول (للمسارات القديمة)
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.cookie('message', '❌ Invalid username or password.');
      return res.redirect('/login');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.cookie('message', '❌ Invalid username or password.');
      return res.redirect('/login');
    }

    const token = generateToken(user); // ✅ استخدام الدالة الجديدة
    res.cookie('token', token, { httpOnly: true });

    return res.redirect(user.isAdmin ? '/dashboard/admin' : '/dashboard/user');

  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).send('❌ Error logging in.');
  }
};

// ✅ تسجيل الخروج (للمسارات القديمة)
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

// ===== API (JSON) =====

// POST /api/auth/register
exports.apiRegister = async (req, res) => {
  const { username, firstName, lastName, email, phone, password, confirmPassword } = req.body || {};

  if (!username || !firstName || !lastName || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const userCount = await User.countDocuments();
    const isAdmin = userCount === 0;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      isAdmin
    });
    await newUser.save();

    // إرسال ايميل ترحيبي بشكل غير متزامن
    sendEmail(email, '📚 Welcome to Book Store!', `Hello ${firstName}, thank you for registering!`).catch(() => {});

    const token = generateToken(newUser);
    res.cookie('token', token, { httpOnly: true });
    return res.status(201).json({
      user: { id: newUser.id, username: newUser.username, isAdmin: newUser.isAdmin },
      token
    });
  } catch (err) {
    console.error('❌ Registration error (api):', err);
    return res.status(500).json({ error: 'Error registering user' });
  }
};

// POST /api/auth/login
exports.apiLogin = async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid username or password' });

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });
    return res.json({
      user: { id: user.id, username: user.username, isAdmin: user.isAdmin },
      token
    });
  } catch (err) {
    console.error('❌ Login error (api):', err);
    return res.status(500).json({ error: 'Error logging in' });
  }
};

// POST /api/auth/logout
exports.apiLogout = (req, res) => {
  res.clearCookie('token');
  return res.json({ ok: true });
};

// GET /api/auth/me
exports.apiMe = (req, res) => {
  return res.json({ user: req.user });
};
