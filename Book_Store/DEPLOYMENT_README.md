# 🚀 دليل النشر - Book Store

## 📋 المتطلبات الأساسية

### 1. **Docker & Docker Compose**
```bash
# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# تثبيت Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. **Git**
```bash
# تثبيت Git
sudo apt-get update
sudo apt-get install git
```

## 🔧 إعداد المشروع

### 1. **استنساخ المشروع**
```bash
git clone <your-repository-url>
cd Book_Store
```

### 2. **إنشاء ملفات البيئة**
```bash
# نسخ ملف البيئة
cp production.env.example production.env

# تحديث المتغيرات
nano production.env
```

### 3. **تحديث المتغيرات المطلوبة**
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_actual_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret

# JWT Configuration
JWT_SECRET=your_actual_jwt_secret

# Database
MONGO_INITDB_ROOT_PASSWORD=your_secure_password
```

## 🚀 النشر

### 1. **النشر المحلي (Development)**
```bash
# تشغيل الخدمات
docker-compose up -d

# عرض السجلات
docker-compose logs -f
```

### 2. **النشر في الإنتاج**
```bash
# جعل السكريبت قابل للتنفيذ
chmod +x deploy-production.sh

# تشغيل النشر
./deploy-production.sh
```

### 3. **النشر اليدوي**
```bash
# بناء الصور
docker-compose -f docker-compose.prod.yml build

# تشغيل الخدمات
docker-compose -f docker-compose.prod.yml up -d

# التحقق من الحالة
docker-compose -f docker-compose.prod.yml ps
```

## 🌐 إعداد النطاق

### 1. **تحديث nginx.conf**
```nginx
server_name yourdomain.com;  # غير إلى نطاقك
```

### 2. **إعداد SSL (اختياري)**
```bash
# إنشاء مجلد SSL
mkdir ssl

# نسخ الشهادات
cp your_cert.pem ssl/
cp your_key.pem ssl/
```

### 3. **تحديث DNS**
```
A    yourdomain.com    YOUR_SERVER_IP
```

## 📊 مراقبة التطبيق

### 1. **عرض السجلات**
```bash
# جميع الخدمات
docker-compose -f docker-compose.prod.yml logs -f

# خدمة محددة
docker-compose -f docker-compose.prod.yml logs -f app
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### 2. **عرض الإحصائيات**
```bash
# استخدام الموارد
docker stats

# مساحة التخزين
docker system df
```

### 3. **فحص الصحة**
```bash
# فحص التطبيق
curl http://localhost/health

# فحص قاعدة البيانات
docker-compose -f docker-compose.prod.yml exec mongo mongosh --eval "db.adminCommand('ping')"
```

## 🔒 الأمان

### 1. **جدار الحماية**
```bash
# فتح المنافذ المطلوبة
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

### 2. **تحديث النظام**
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### 3. **نسخ احتياطية**
```bash
# قاعدة البيانات
docker-compose -f docker-compose.prod.yml exec mongo mongodump --out /backup

# ملفات التطبيق
tar -czf app-backup-$(date +%Y%m%d).tar.gz .
```

## 🚨 استكشاف الأخطاء

### مشكلة: "Port already in use"
```bash
# البحث عن العملية
sudo lsof -i :80
sudo lsof -i :443

# إيقاف العملية
sudo kill -9 <PID>
```

### مشكلة: "Permission denied"
```bash
# إصلاح الصلاحيات
sudo chown -R $USER:$USER .
chmod +x *.sh
```

### مشكلة: "MongoDB connection failed"
```bash
# التحقق من حالة MongoDB
docker-compose -f docker-compose.prod.yml logs mongo

# إعادة تشغيل الخدمة
docker-compose -f docker-compose.prod.yml restart mongo
```

## 📱 أوامر مفيدة

### إدارة الخدمات
```bash
# إيقاف
docker-compose -f docker-compose.prod.yml down

# إعادة تشغيل
docker-compose -f docker-compose.prod.yml restart

# إعادة بناء
docker-compose -f docker-compose.prod.yml up --build -d
```

### التنظيف
```bash
# تنظيف الصور
docker system prune -a

# تنظيف الحاويات
docker container prune

# تنظيف الشبكات
docker network prune
```

## 🔄 التحديثات

### 1. **سحب التحديثات**
```bash
git pull origin main
```

### 2. **إعادة النشر**
```bash
./deploy-production.sh
```

### 3. **التراجع**
```bash
git checkout <previous-commit>
./deploy-production.sh
```

## 📞 الدعم

للمساعدة أو الاستفسارات:
- تحقق من السجلات: `docker-compose logs`
- راجع حالة الخدمات: `docker-compose ps`
- تحقق من الموارد: `docker stats`
