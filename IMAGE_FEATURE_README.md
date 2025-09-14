# إضافة ميزة رفع صور الكتب

## التحديثات المنجزة

### 1. قاعدة البيانات (Backend)
- ✅ إضافة حقل `image` إلى نموذج الكتاب في `Book_Store/models/bookModel.js`
- ✅ تثبيت multer middleware لرفع الملفات
- ✅ إنشاء مجلد `uploads/images` لحفظ الصور
- ✅ تحديث جميع controllers للتعامل مع الملفات المرفوعة
- ✅ تحديث API endpoints (GET, POST, PUT, DELETE) لاستقبال الملفات
- ✅ إضافة خدمة الملفات الثابتة في app.js

### 2. الواجهة الأمامية (Frontend)
- ✅ إضافة حقل رفع ملف في صفحة إضافة كتاب جديد
- ✅ إضافة حقل رفع ملف في BookCard component للتعديل
- ✅ تحسين عرض الصور مع أبعاد ثابتة وتنسيق مناسب
- ✅ إضافة التحقق من نوع وحجم الملفات
- ✅ تحديث بيانات الكتب الموجودة لتشمل صور افتراضية

## كيفية الاستخدام

### إضافة كتاب جديد مع صورة:
1. اذهب إلى صفحة "Add New Book"
2. املأ جميع الحقول المطلوبة
3. في حقل "Book Cover Image" اختر ملف صورة من جهازك
4. اضغط "Add Book"

### تعديل صورة كتاب موجود:
1. اذهب إلى صفحة الكتب
2. اضغط "Edit" على الكتاب المطلوب
3. اختر ملف صورة جديد في حقل "Book Cover Image"
4. اضغط "Save"

## ملاحظات مهمة

- **نوع الملفات المسموحة**: صور فقط (JPG, PNG, GIF, etc.)
- **حجم الملف الأقصى**: 5 ميجابايت
- **حفظ الصور**: يتم حفظها في مجلد `Book_Store/uploads/images/`
- **عرض الصور**: تظهر بأبعاد ثابتة (200px ارتفاع) مع تنسيق `object-fit: cover`
- **صورة افتراضية**: إذا لم يتم رفع صورة، تظهر صورة افتراضية
- **معالجة الأخطاء**: إذا فشل تحميل الصورة، تظهر الصورة الافتراضية

## الملفات المحدثة

### Backend:
- `Book_Store/package.json` - إضافة multer
- `Book_Store/middleware/uploadMiddleware.js` - middleware لرفع الملفات
- `Book_Store/app.js` - إضافة خدمة الملفات الثابتة
- `Book_Store/models/bookModel.js` - إضافة حقل الصورة
- `Book_Store/controllers/bookController.js` - تحديث جميع العمليات
- `Book_Store/routes/apiBookRoutes.js` - إضافة middleware رفع الملفات
- `Book_Store/data/books.json` - تحديث مسارات الصور

### Frontend:
- `Front_React/src/pages/admin/AddBook.jsx` - إضافة رفع الملفات
- `Front_React/src/components/BookCard.jsx` - تحديث رفع وعرض الصور
- `Front_React/src/pages/Books.jsx` - تحديث معالجة FormData

## اختبار الميزة

1. **تثبيت التبعيات**:
   ```bash
   cd Book_Store
   npm install
   ```

2. **شغل الخادم**:
   ```bash
   npm start
   ```

3. **شغل الواجهة الأمامية**:
   ```bash
   cd Front_React
   npm run dev
   ```

4. **اختبار الميزة**:
   - اذهب إلى صفحة إضافة كتاب جديد
   - جرب رفع صورة من جهازك
   - تحقق من ظهور الصورة في صفحة الكتب
   - جرب تعديل صورة كتاب موجود

## هيكل الملفات

```
Book_Store/
├── uploads/
│   └── images/          # مجلد حفظ الصور المرفوعة
├── middleware/
│   └── uploadMiddleware.js  # middleware لرفع الملفات
└── ...
```
