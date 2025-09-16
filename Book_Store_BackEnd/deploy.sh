#!/bin/bash

# 🚀 سكريبت نشر Book Store
# استخدم: ./deploy.sh [production|staging]

set -e

# تحديد البيئة
ENVIRONMENT=${1:-staging}
echo "🚀 بدء النشر في بيئة: $ENVIRONMENT"

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

# إيقاف الخدمات الحالية
echo "🛑 إيقاف الخدمات الحالية..."
docker-compose down

# تنظيف الصور القديمة
echo "🧹 تنظيف الصور القديمة..."
docker system prune -f

# بناء الصور الجديدة
echo "🔨 بناء الصور الجديدة..."
docker-compose build --no-cache

# تشغيل الخدمات
echo "▶️ تشغيل الخدمات..."
docker-compose up -d

# انتظار بدء الخدمات
echo "⏳ انتظار بدء الخدمات..."
sleep 10

# التحقق من حالة الخدمات
echo "🔍 التحقق من حالة الخدمات..."
docker-compose ps

# التحقق من صحة التطبيق
echo "🏥 التحقق من صحة التطبيق..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ التطبيق يعمل بنجاح!"
    echo "🌐 يمكنك الوصول للتطبيق على: http://localhost:3000"
else
    echo "❌ التطبيق لا يستجيب. تحقق من السجلات:"
    docker-compose logs app
    exit 1
fi

echo "🎉 النشر مكتمل بنجاح!"
