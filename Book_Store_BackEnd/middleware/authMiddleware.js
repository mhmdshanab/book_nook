// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is not defined in .env file!");
}

// 📌 دالة مساعدة للتحقق من التوكن
function verifyTokenMiddleware(req, res) {
  const token = req.cookies.token || (
    req.headers.authorization?.startsWith("Bearer ") 
      ? req.headers.authorization.split(" ")[1] 
      : null
  );

  if (!token) {
    console.log("❌ No token found in request.");
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token verified successfully:", decoded);
    return decoded;
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    res.clearCookie("token"); // مسح التوكن من الكوكيز
    return null;
  }
}

// ✅ يتأكد من أن المستخدم مسجّل دخول
function requireAuth (req, res, next) {
  const user = verifyTokenMiddleware(req, res);
  if (!user) { 
    console.log("🔒 Access denied: user not authenticated.");
    return res.redirect('/login?expired=1');
  }
  req.user = user;
  next();
}

// ✅ يتأكد من أن المستخدم أدمن
function requireAdmin(req, res, next) {
  const user = verifyTokenMiddleware(req, res);
  if (!user) {
    console.log("🔒 Access denied: invalid or missing token.");
    return res.redirect('/login?expired=1');

  }

  if (!user.isAdmin) {
    console.log("⚠️ Access denied: user is not an admin.");
    req.session.message = "⚠️ Admin access only.";
    return res.redirect("/login");
  }

  req.user = user;
  res.locals.user = user;
  next();
}

// ✅ استخدام عام للتحقق فقط دون صلاحيات خاصة
function verifyToken(req, res, next) {
  const user = verifyTokenMiddleware(req, res);
  if (!user) {
    return res.redirect('/login?expired=1');

  }

  req.user = user;
  res.locals.user = user;
  next();
}


function setUser(req, res, next)  {
  const token = req.cookies.token;
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.warn('⚠️ JWT_SECRET not defined in .env file!');
  }

  if (token && secret) {
    try {
      const decoded = jwt.verify(token, secret); // ← لو انتهت الصلاحية، سيلقي خطأ
      res.locals.user = decoded;  // ← متاح في EJS
      return next() ;
    } catch (err) {
      console.error('🔐 Token expired or invalid:', err.message);
      res.clearCookie('token');
      return res.redirect('/login?expired=1');
    }
  } else {
    res.locals.user = null;
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  verifyToken,
  setUser,
  // ✅ ميدلوير خاص بمسارات الـ API يُعيد JSON بدلاً من إعادة التوجيه
  requireAuthApi: function requireAuthApi(req, res, next) {
    const user = verifyTokenMiddleware(req, res);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    res.locals.user = user;
    next();
  },
  // ✅ ميدلوير أدمن لواجهات الـ API
  requireAdminApi: function requireAdminApi(req, res, next) {
    const user = verifyTokenMiddleware(req, res);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden: admin only' });
    }
    req.user = user;
    res.locals.user = user;
    next();
  }
};
