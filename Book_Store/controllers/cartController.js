const CartItem = require('../models/cartModel');
const Book = require('../models/bookModel');

// ✅ عرض السلة
exports.getCart = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const cart = await CartItem.find({ userId }).populate('bookId');

    // تصفية العناصر الصحيحة فقط
    const validCart = cart.filter(item => item.bookId && item.bookId._id);

    const totalQuantity = validCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = validCart.reduce((sum, item) => sum + item.quantity * (item.bookId?.price || 0), 0);

    res.render('all-cart', {
      cart: validCart,
      totalQuantity,
      totalPrice,
      message: null,
      user,
      stripeKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (err) {
    console.error('❌ Error loading cart:', err);
    res.status(500).send('❌ Error loading cart.');
  }
};

// ✅ إضافة كتاب إلى السلة
exports.addToCart = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const bookId = req.body.bookId;

    if (!bookId) {
      return res.render('all-books', { books: [], message: '❌ Book ID is required.', user });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.render('all-books', { books: [], message: '❌ Book not found.', user });
    }
    
    if (book.stock <= 0) {
      return res.render('all-books', { books: [], message: '❌ This book is out of stock.', user });
    }

    let item = await CartItem.findOne({ userId, bookId });

    if (item) {
      item.quantity++;
      await item.save();
    } else {
      await CartItem.create({ userId, bookId, quantity: 1 });
    }

    book.stock--;
    await book.save();

    res.redirect('/books/allBooks');
  } catch (err) {
    console.error('❌ Error adding to cart:', err);
    res.status(500).send('❌ Error adding to cart.');
  }
};

// ✅ زيادة كمية كتاب
exports.increaseQuantity = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const bookId = req.params.id;

    const item = await CartItem.findOne({ userId, bookId });
    const book = await Book.findById(bookId);

    if (!book || !item) {
      return res.redirect('/cart/allCart');
    }

    if (book.stock <= 0) {
      return res.redirect('/cart/allCart');
    }

    item.quantity++;
    await item.save();

    book.stock--;
    await book.save();

    res.redirect('/cart/allCart');
  } catch (err) {
    console.error('❌ Error increasing quantity:', err);
    res.status(500).send('❌ Error increasing quantity.');
  }
};

// ✅ تقليل كمية كتاب
exports.decreaseQuantity = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const bookId = req.params.id;

    const item = await CartItem.findOne({ userId, bookId });
    const book = await Book.findById(bookId);

    if (!item || !book) {
      return res.redirect('/cart/allCart');
    }

    if (item.quantity <= 1) {
      await item.deleteOne();
    } else {
      item.quantity--;
      await item.save();
    }

    book.stock++;
    await book.save();

    res.redirect('/cart/allCart');
  } catch (err) {
    console.error('❌ Error decreasing quantity:', err);
    res.status(500).send('❌ Error decreasing quantity.');
  }
};

// ✅ حذف عنصر من السلة
exports.removeFromCart = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const bookId = req.params.id;

    const item = await CartItem.findOne({ userId, bookId });
    const book = await Book.findById(bookId);

    if (!item) {
      return res.redirect('/cart/allCart');
    }

    if (book) {
      book.stock += item.quantity;
      await book.save();
    }

    await item.deleteOne();

    res.redirect('/cart/allCart');
  } catch (err) {
    console.error('❌ Error removing item:', err);
    res.status(500).send('❌ Error removing item.');
  }
};

// ✅ تفريغ السلة
exports.emptyCart = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const cartItems = await CartItem.find({ userId });

    for (const item of cartItems) {
      const book = await Book.findById(item.bookId);
      if (book) {
        book.stock += item.quantity;
        await book.save();
      }
      await item.deleteOne();
    }

    res.redirect('/cart/allCart');
  } catch (err) {
    console.error('❌ Error emptying cart:', err);
    res.status(500).send('❌ Error emptying cart.');
  }
};

// ✅ تنظيف السلة من العناصر غير الصحيحة
exports.cleanCart = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) return res.redirect('/login');

    const userId = user.id;
    const cartItems = await CartItem.find({ userId });

    for (const item of cartItems) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        // إذا لم يعد الكتاب موجوداً، أزل العنصر من السلة
        await item.deleteOne();
        console.log(`🗑️ Removed invalid cart item for book ID: ${item.bookId}`);
      }
    }

    res.redirect('/cart/allCart');
  } catch (err) {
    console.error('❌ Error cleaning cart:', err);
    res.status(500).send('❌ Error cleaning cart.');
  }
};

// ===== API (JSON) =====
// GET /api/cart
exports.getCartApi = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await CartItem.find({ userId }).populate('bookId');
    const validCart = cart.filter(item => item.bookId && item.bookId._id);
    const totalQuantity = validCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = validCart.reduce((sum, item) => sum + item.quantity * (item.bookId?.price || 0), 0);
    res.json({ items: validCart, totalQuantity, totalPrice });
  } catch (err) {
    console.error('❌ Error loading cart (api):', err);
    res.status(500).json({ error: 'Error loading cart' });
  }
};

// POST /api/cart/add
exports.addToCartApi = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, quantity } = req.body || {};
    if (!bookId) return res.status(400).json({ error: 'Book ID is required' });
    const qty = Number.isFinite(Number(quantity)) && Number(quantity) > 0 ? Math.trunc(Number(quantity)) : 1;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.stock < qty) return res.status(400).json({ error: 'Out of stock' });

    let item = await CartItem.findOne({ userId, bookId });
    if (item) {
      item.quantity += qty;
      await item.save();
    } else {
      await CartItem.create({ userId, bookId, quantity: qty });
    }
    book.stock -= qty;
    await book.save();
    return exports.getCartApi(req, res);
  } catch (err) {
    console.error('❌ Error adding to cart (api):', err);
    res.status(500).json({ error: 'Error adding to cart' });
  }
};

// POST /api/cart/increase/:id
exports.increaseQuantityApi = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.id;
    const item = await CartItem.findOne({ userId, bookId });
    const book = await Book.findById(bookId);
    if (!item || !book) return res.status(404).json({ error: 'Item not found' });
    if (book.stock <= 0) return res.status(400).json({ error: 'Out of stock' });
    item.quantity++;
    await item.save();
    book.stock--;
    await book.save();
    return exports.getCartApi(req, res);
  } catch (err) {
    console.error('❌ Error increasing quantity (api):', err);
    res.status(500).json({ error: 'Error increasing quantity' });
  }
};

// POST /api/cart/decrease/:id
exports.decreaseQuantityApi = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.id;
    const item = await CartItem.findOne({ userId, bookId });
    const book = await Book.findById(bookId);
    if (!item || !book) return res.status(404).json({ error: 'Item not found' });
    if (item.quantity <= 1) {
      await item.deleteOne();
    } else {
      item.quantity--;
      await item.save();
    }
    book.stock++;
    await book.save();
    return exports.getCartApi(req, res);
  } catch (err) {
    console.error('❌ Error decreasing quantity (api):', err);
    res.status(500).json({ error: 'Error decreasing quantity' });
  }
};

// DELETE /api/cart/item/:id
exports.removeFromCartApi = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.id;
    const item = await CartItem.findOne({ userId, bookId });
    const book = await Book.findById(bookId);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (book) { book.stock += item.quantity; await book.save(); }
    await item.deleteOne();
    return exports.getCartApi(req, res);
  } catch (err) {
    console.error('❌ Error removing item (api):', err);
    res.status(500).json({ error: 'Error removing item' });
  }
};

// POST /api/cart/empty
exports.emptyCartApi = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await CartItem.find({ userId });
    for (const item of cartItems) {
      const book = await Book.findById(item.bookId);
      if (book) { book.stock += item.quantity; await book.save(); }
      await item.deleteOne();
    }
    return exports.getCartApi(req, res);
  } catch (err) {
    console.error('❌ Error emptying cart (api):', err);
    res.status(500).json({ error: 'Error emptying cart' });
  }
};

// PUT /api/cart/item/:id  { quantity }
exports.setQuantityApi = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.id;
    const desired = Number.isFinite(Number(req.body?.quantity)) ? Math.max(0, Math.trunc(Number(req.body.quantity))) : null;
    if (desired == null) return res.status(400).json({ error: 'quantity is required' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    let item = await CartItem.findOne({ userId, bookId });
    const currentQty = item ? item.quantity : 0;
    const delta = desired - currentQty;

    if (delta === 0) {
      return exports.getCartApi(req, res);
    }

    if (delta > 0) {
      // Need to add more units → ensure stock
      if (book.stock < delta) return res.status(400).json({ error: 'Out of stock' });
      if (item) {
        item.quantity += delta;
        await item.save();
      } else {
        item = await CartItem.create({ userId, bookId, quantity: desired });
      }
      book.stock -= delta;
      await book.save();
    } else {
      // Reduce quantity and return stock
      const reduceBy = Math.abs(delta);
      if (desired === 0 && item) {
        await item.deleteOne();
      } else if (item) {
        item.quantity = desired;
        await item.save();
      }
      book.stock += reduceBy;
      await book.save();
    }

    return exports.getCartApi(req, res);
  } catch (err) {
    console.error('❌ Error setting cart quantity (api):', err);
    res.status(500).json({ error: 'Error setting quantity' });
  }
};