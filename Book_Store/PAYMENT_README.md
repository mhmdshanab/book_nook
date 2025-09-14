# 💳 بوابة الدفع - Book Store

## 🚀 الميزات المتاحة

### ✅ الميزات الأساسية
- **Stripe Checkout**: بوابة دفع آمنة ومؤتمتة
- **إدارة السلة**: إضافة/إزالة/تعديل الكميات
- **التحقق من المخزون**: منع الطلبات التي تتجاوز المخز المتاح
- **تأكيد الطلبات**: صفحات نجاح وإلغاء الدفع
- **Webhooks**: معالجة أحداث الدفع تلقائياً

### 🔒 الأمان
- **JWT Authentication**: تسجيل دخول آمن
- **Stripe Security**: معايير أمان عالية
- **Input Validation**: التحقق من المدخلات
- **Error Handling**: معالجة شاملة للأخطاء

## 📋 متطلبات التشغيل

### 1. المتغيرات البيئية
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/book_store
```

### 2. تثبيت الحزم
```bash
npm install stripe express mongoose jsonwebtoken
```

## 🛠️ كيفية الاستخدام

### 1. إضافة كتب إلى السلة
```javascript
// في صفحة الكتب
<form method="POST" action="/cart/add-to-cart">
  <input type="hidden" name="bookId" value="<%= book._id %>">
  <button type="submit">Add to Cart</button>
</form>
```

### 2. عرض السلة
```javascript
// GET /cart/allCart
// يعرض جميع العناصر في السلة مع إجمالي السعر
```

### 3. الدفع
```javascript
// في صفحة السلة
<button id="checkout-btn">💳 Proceed to Checkout</button>

// JavaScript للدفع
document.getElementById('checkout-btn').addEventListener('click', async function() {
  const response = await fetch('/payment/create-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  
  const { sessionId } = await response.json();
  const stripe = Stripe('your_publishable_key');
  await stripe.redirectToCheckout({ sessionId });
});
```

## 🔄 تدفق العملية

### 1. إضافة للسلعة
```
User → Add to Cart → Cart Updated → Stock Decreased
```

### 2. عملية الدفع
```
Cart → Checkout → Stripe → Payment Success/Failure → Order Confirmation
```

### 3. بعد الدفع
```
Payment Success → Cart Cleared → Stock Updated → Order Confirmed
```

## 📱 واجهات المستخدم

### 1. صفحة السلة (`/cart/allCart`)
- عرض العناصر المضافة
- تعديل الكميات
- حساب الإجمالي
- زر الدفع

### 2. صفحة نجاح الدفع (`/payment/success`)
- تأكيد الطلب
- تفاصيل الدفع
- روابط للاستمرار

### 3. صفحة إلغاء الدفع (`/payment/cancel`)
- رسالة الإلغاء
- العودة للسلة

## 🧪 اختبار النظام

### 1. بطاقات الاختبار
```bash
# نجاح الدفع
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444

# فشل الدفع
Decline: 4000 0000 0000 0002
Insufficient: 4000 0000 0000 9995
```

### 2. اختبار Webhook
```bash
# استخدام Stripe CLI
stripe listen --forward-to localhost:3000/payment/webhook
```

## 🚨 استكشاف الأخطاء

### مشكلة: "Stripe is not defined"
**الحل**: تأكد من تحميل Stripe.js
```html
<script src="https://js.stripe.com/v3/"></script>
```

### مشكلة: "Invalid API key"
**الحل**: تحقق من صحة المفاتيح في ملف .env

### مشكلة: "Cart is empty"
**الحل**: تأكد من وجود عناصر في السلة

### مشكلة: "Insufficient stock"
**الحل**: تحقق من المخز المتاح للكتب

## 🔧 التخصيص

### 1. تغيير العملة
```javascript
// في paymentController.js
currency: 'usd', // غير إلى 'eur', 'gbp', إلخ
```

### 2. إضافة دول الشحن
```javascript
allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'AE', 'SA', 'EG']
```

### 3. تخصيص رسائل الخطأ
```javascript
// في paymentController.js
return res.status(400).json({ 
  error: 'رسالة خطأ مخصصة' 
});
```

## 📊 المراقبة والتتبع

### 1. Logs
```javascript
console.log('✅ Payment session created:', session.id);
console.log('✅ Payment completed via webhook:', session.id);
```

### 2. Stripe Dashboard
- مراقبة المدفوعات
- تحليل الإيرادات
- تتبع العملاء

## 🚀 النشر

### 1. الإنتاج
```bash
# تحديث المتغيرات البيئية
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 2. HTTPS
```bash
# ضروري للإنتاج
# Stripe يتطلب HTTPS للعمل
```

### 3. Webhook URL
```bash
# تحديث URL في Stripe Dashboard
https://yourdomain.com/payment/webhook
```

## 📞 الدعم

للمساعدة أو الاستفسارات:
- تحقق من [Stripe Documentation](https://stripe.com/docs)
- راجع ملفات Log للتطبيق
- تأكد من صحة المفاتيح والإعدادات
