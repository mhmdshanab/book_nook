#!/bin/bash

# 🚀 سكريبت نشر Book Store للإنتاج
# استخدم: ./deploy-production.sh

set -e

echo "🚀 بدء النشر في بيئة الإنتاج..."

# التحقق من وجود Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker غير مثبت. يرجى تثبيت Docker أولاً."
    exit 1
fi

# التحقق من وجود Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose غير مثبت. يرجى تثبيت Docker Compose أولاً."
    exit 1
fi

# التحقق من وجود ملف production.env
if [ ! -f "production.env" ]; then
    echo "❌ ملف production.env غير موجود. يرجى إنشاؤه أولاً."
    exit 1
fi

# التحقق من المتغيرات المطلوبة
echo "🔍 التحقق من المتغيرات البيئية..."
source production.env

required_vars=(
    "JWT_SECRET"
    "STRIPE_SECRET_KEY"
    "STRIPE_PUBLISHABLE_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "SESSION_SECRET"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ] || [[ "${!var}" == *"your_"* ]]; then
        echo "❌ المتغير $var غير محدد أو يحتوي على قيمة افتراضية."
        echo "يرجى تحديث ملف production.env"
        exit 1
    fi
done

echo "✅ جميع المتغيرات المطلوبة محددة."

# إيقاف الخدمات الحالية
echo "🛑 إيقاف الخدمات الحالية..."
docker-compose -f docker-compose.prod.yml down

# تنظيف الصور القديمة
echo "🧹 تنظيف الصور القديمة..."
docker system prune -f

# بناء الصور الجديدة
echo "🔨 بناء الصور الجديدة..."
docker-compose -f docker-compose.prod.yml build --no-cache

# تشغيل الخدمات
echo "▶️ تشغيل الخدمات..."
docker-compose -f docker-compose.prod.yml up -d

# انتظار بدء الخدمات
echo "⏳ انتظار بدء الخدمات..."
sleep 30

# التحقق من حالة الخدمات
echo "🔍 التحقق من حالة الخدمات..."
docker-compose -f docker-compose.prod.yml ps

# التحقق من صحة التطبيق
echo "🏥 التحقق من صحة التطبيق..."
max_attempts=10
attempt=1

while [ $attempt -le $max_attempts ]; do
    echo "محاولة $attempt من $max_attempts..."
    
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo "✅ التطبيق يعمل بنجاح!"
        break
    else
        if [ $attempt -eq $max_attempts ]; then
            echo "❌ التطبيق لا يستجيب بعد $max_attempts محاولات."
            echo "تحقق من السجلات:"
            docker-compose -f docker-compose.prod.yml logs app
            exit 1
        fi
        echo "⏳ انتظار 10 ثوانٍ..."
        sleep 10
        attempt=$((attempt + 1))
    fi
done

# التحقق من قاعدة البيانات
echo "🗄️ التحقق من قاعدة البيانات..."
if docker-compose -f docker-compose.prod.yml exec mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ قاعدة البيانات تعمل بنجاح!"
else
    echo "❌ مشكلة في قاعدة البيانات."
    docker-compose -f docker-compose.prod.yml logs mongo
fi

# عرض معلومات النشر
echo ""
echo "🎉 النشر مكتمل بنجاح!"
echo "🌐 يمكنك الوصول للتطبيق على: http://localhost"
echo "📊 حالة الخدمات:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "📝 أوامر مفيدة:"
echo "  عرض السجلات: docker-compose -f docker-compose.prod.yml logs -f"
echo "  إيقاف الخدمات: docker-compose -f docker-compose.prod.yml down"
echo "  إعادة تشغيل: docker-compose -f docker-compose.prod.yml restart"
echo "  عرض الاستخدام: docker system df"
