# 🚀 إعداد بوابة الدفع Stripe

## 📋 المتطلبات الأساسية

1. **إنشاء حساب Stripe**: 
   - اذهب إلى [stripe.com](https://stripe.com)
   - أنشئ حساب جديد
   - أكمل عملية التحقق

## 🔑 الحصول على المفاتيح

### 1. مفتاح الاختبار (Test Mode)
```bash
# في ملف .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. مفتاح الإنتاج (Live Mode)
```bash
# في ملف .env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## ⚙️ إعداد الملفات

### 1. تحديث ملف .env
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 2. التأكد من تثبيت الحزم
```bash
npm install stripe
```

## 🧪 اختبار النظام

### 1. بطاقات الاختبار
- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **Expiry**: أي تاريخ مستقبلي
- **CVC**: أي 3 أرقام

### 2. محاكاة الأخطاء
- **Decline**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9995

## 🔒 الأمان

- **لا تشارك** مفتاح `STRIPE_SECRET_KEY` أبداً
- استخدم HTTPS في الإنتاج
- تحقق من webhook signatures
- استخدم Stripe Elements للبطاقات

## 📱 اختبار التطبيق

1. أضف كتب إلى السلة
2. اذهب إلى صفحة السلة
3. اضغط "Proceed to Checkout"
4. أكمل عملية الدفع
5. تحقق من نجاح العملية

## 🚨 استكشاف الأخطاء

### مشكلة: "Stripe is not defined"
- تأكد من تحميل Stripe.js
- تحقق من صحة المفتاح العام

### مشكلة: "Invalid API key"
- تحقق من صحة المفتاح السري
- تأكد من وضع الاختبار/الإنتاج

### مشكلة: "Cart is empty"
- تأكد من وجود عناصر في السلة
- تحقق من قاعدة البيانات
