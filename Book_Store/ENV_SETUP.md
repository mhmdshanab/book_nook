# 🔧 إعداد المتغيرات البيئية - Book Store

## 📋 إنشاء ملف .env

قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع مع المحتوى التالي:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/book_store

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Configuration (اختياري)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Session Secret
SESSION_SECRET=your_session_secret_here
```

## 🔑 الحصول على مفاتيح Stripe

### 1. إنشاء حساب Stripe
- اذهب إلى [stripe.com](https://stripe.com)
- أنشئ حساب جديد
- أكمل عملية التحقق

### 2. الحصول على المفاتيح
- في Stripe Dashboard، اذهب إلى Developers > API keys
- انسخ `Publishable key` و `Secret key`
- استخدم مفاتيح الاختبار أولاً (تبدأ بـ `pk_test_` و `sk_test_`)

### 3. إعداد Webhook
- في Stripe Dashboard، اذهب إلى Developers > Webhooks
- أضف endpoint جديد: `https://yourdomain.com/payment/webhook`
- انسخ `Signing secret`

## 🚨 ملاحظات مهمة

### الأمان
- **لا تشارك** `STRIPE_SECRET_KEY` أبداً
- **لا تشارك** `JWT_SECRET` أبداً
- استخدم HTTPS في الإنتاج

### الاختبار
- استخدم مفاتيح الاختبار للتطوير
- استخدم مفاتيح الإنتاج للنشر

## 🧪 اختبار الإعداد

### 1. تشغيل التطبيق
```bash
npm start
```

### 2. التحقق من الاتصال
- تأكد من عدم وجود أخطاء في Console
- تحقق من رسائل "✅ Server is running"

### 3. اختبار الدفع
- أضف كتب إلى السلة
- اضغط "Proceed to Checkout"
- استخدم بطاقات الاختبار

## 🔧 استكشاف الأخطاء

### مشكلة: "JWT_SECRET is not defined"
**الحل**: تأكد من وجود `JWT_SECRET` في ملف `.env`

### مشكلة: "STRIPE_SECRET_KEY is not defined"
**الحل**: تأكد من وجود `STRIPE_SECRET_KEY` في ملف `.env`

### مشكلة: "MongoDB connection failed"
**الحل**: تأكد من تشغيل MongoDB وتصحيح `MONGODB_URI`

## 📱 النشر

### 1. تحديث المتغيرات للإنتاج
```bash
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
