// controllers/bookController.js
const Book = require('../models/bookModel');

// ✅ عرض كل الكتب
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ stock: { $gt: 0 } });
    const user = req.user || res.locals.user || null;
    const message = null;

    res.render('all-books', { books, message, user });
  } catch (err) {
    console.error('❌ Error loading books from DB:', err);
    res.status(500).send('❌ Error loading books from DB.');
  }
};

// ✅ صفحة إضافة كتاب
exports.getAddBookPage = (req, res) => {
  const user = req.user || res.locals.user || null;
  res.render('add-book', { user, message: null });
};

// ✅ حفظ كتاب جديد
exports.postAddBook = async (req, res) => {
  const { title, price, description, stock, image } = req.body;

  if (!title || !price || !description || !stock) {
    return res.render('add-book', { user: req.user, message: '❌ All fields are required.' });
  }

  try {
    await Book.create({
      title,
      price: parseFloat(price),
      description,
      stock: parseInt(stock),
      image: image || '/assets/img/products-01.png'
    });

    res.render('add-book', { user: req.user, message: '✅ Book added successfully.' });
  } catch (err) {
    console.error('❌ Error saving book:', err);
    res.status(500).send('❌ Error saving book.');
  }
};

// ✅ عرض صفحة تعديل كتاب
exports.getEditBookPage = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.redirect('/books/allBooks');
    }

    res.render('edit-book', { book, user: req.user });
  } catch (err) {
    console.error('❌ Error fetching book:', err);
    res.status(500).send('❌ Error fetching book.');
  }
};

// ✅ تعديل بيانات كتاب
exports.postEditBook = async (req, res) => {
  const { title, price, description, stock, image } = req.body;

  if (!title || !price || !description || !stock) {
    return res.render('edit-book', {
      book: { _id: req.params.id, title, price, description, stock, image },
      user: req.user,
      message: '❌ All fields are required.'
    });
  }

  try {
    await Book.findByIdAndUpdate(req.params.id, {
      title,
      price: parseFloat(price),
      description,
      stock: parseInt(stock),
      image: image || '/assets/img/products-01.png'
    });

    res.redirect('/books/allBooks');
  } catch (err) {
    console.error('❌ Error updating book:', err);
    res.status(500).send('❌ Error updating book.');
  }
};

// ✅ حذف كتاب
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books/allBooks');
  } catch (err) {
    console.error('❌ Error deleting book:', err);
    res.status(500).send('❌ Error deleting book.');
  }
};

// ===== API (JSON) =====
// GET /api/books
exports.getAllBooksApi = async (req, res) => {
  try {
    const books = await Book.find({ stock: { $gt: 0 } });
    res.json({ books });
  } catch (err) {
    console.error('❌ Error loading books from DB (api):', err);
    res.status(500).json({ error: 'Error loading books from DB' });
  }
};

// GET /api/books/:id
exports.getBookByIdApi = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ book });
  } catch (err) {
    console.error('❌ Error fetching book (api):', err);
    res.status(500).json({ error: 'Error fetching book' });
  }
};

// POST /api/books
exports.createBookApi = async (req, res) => {
  try {
    const { title, price, description, stock } = req.body || {};
    if (!title || price == null) return res.status(400).json({ error: 'title and price are required' });
    
    // تحديد مسار الصورة
    let imagePath = '/assets/img/products-01.png'; // صورة افتراضية
    if (req.file) {
      imagePath = `/uploads/images/${req.file.filename}`;
    }
    
    const created = await Book.create({
      title,
      price: Number(price),
      description: description || 'No description provided',
      stock: Number.isFinite(Number(stock)) ? Number(stock) : 0,
      image: imagePath
    });
    res.status(201).json({ book: created });
  } catch (err) {
    console.error('❌ Error creating book (api):', err);
    res.status(500).json({ error: 'Error creating book' });
  }
};

// PUT /api/books/:id
exports.updateBookApi = async (req, res) => {
  try {
    const { title, price, description, stock } = req.body || {};
    const update = {};
    if (title != null) update.title = title;
    if (price != null) update.price = Number(price);
    if (description != null) update.description = description;
    if (stock != null) update.stock = Number(stock);
    
    // تحديث الصورة إذا تم رفع ملف جديد
    if (req.file) {
      update.image = `/uploads/images/${req.file.filename}`;
    }
    
    const updated = await Book.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ error: 'Book not found' });
    res.json({ book: updated });
  } catch (err) {
    console.error('❌ Error updating book (api):', err);
    res.status(500).json({ error: 'Error updating book' });
  }
};

// DELETE /api/books/:id
exports.deleteBookApi = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Book not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('❌ Error deleting book (api):', err);
    res.status(500).json({ error: 'Error deleting book' });
  }
};