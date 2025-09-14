// controllers/paymentController.js
const stripe = require('../config/stripe');
const CartItem = require('../models/cartModel');
const Book = require('../models/bookModel');

// ✅ إنشاء جلسة دفع
exports.createPaymentSession = async (req, res) => {
  try {
    const user = req.user || res.locals.user;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // جلب محتويات السلة
    const cartItems = await CartItem.find({ userId: user.id }).populate('bookId');
    
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // تصفية العناصر الصحيحة فقط
    const validCartItems = cartItems.filter(item => item.bookId && item.bookId._id);
    
    if (validCartItems.length === 0) {
      return res.status(400).json({ error: 'No valid items in cart' });
    }

    // حساب المجموع
    const totalAmount = validCartItems.reduce((sum, item) => {
      return sum + (item.quantity * (item.bookId?.price || 0));
    }, 0);

    // ملاحظة: تم خصم المخزون مسبقاً عند إضافة العناصر للسلة
    // لذا لا نعيد رفض الدفع حتى لو كان stock الحالي صفر.
    // نتحقق فقط من وجود بيانات الكتاب.
    for (const item of validCartItems) {
      if (!item.bookId) {
        return res.status(400).json({ error: 'Invalid book data in cart' });
      }
    }

    // إنشاء line items لـ Stripe
    const lineItems = validCartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.bookId.title || 'Unknown Book',
          description: item.bookId.description || 'No description available',
          images: ['https://via.placeholder.com/150x200/007bff/ffffff?text=Book'], // صورة افتراضية
        },
        unit_amount: Math.round((item.bookId.price || 0) * 100), // Stripe يتعامل بالسنت
      },
      quantity: item.quantity,
    }));

    // إنشاء جلسة الدفع
    const frontendOrigin = process.env.FRONTEND_ORIGIN || `${req.protocol}://${req.get('host')}`;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontendOrigin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendOrigin}/payment/cancel`,
      metadata: {
        userId: user.id,
        username: user.username,
        cartItems: JSON.stringify(validCartItems.map(item => ({
          bookId: item.bookId._id.toString(),
          quantity: item.quantity,
          price: item.bookId.price || 0
        })))
      },
      customer_email: user.email || undefined,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'AE', 'SA', 'EG']
      }
    });

    console.log('✅ Payment session created:', session.id);
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Payment session creation error:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
};

// ===== API (JSON) =====
// POST /api/payment/create-session
exports.apiCreatePaymentSession = async (req, res) => {
  return exports.createPaymentSession(req, res);
};

// ✅ نجاح الدفع
exports.paymentSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.redirect('/cart/allCart');
    }

    // التحقق من جلسة الدفع
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      const user = req.user || res.locals.user;
      
      if (user && session.metadata.cartItems) {
        try {
          // تحديث المخز بناءً على العناصر المشتراة
          const cartItems = JSON.parse(session.metadata.cartItems);
          
                     for (const item of cartItems) {
             if (item.bookId) {
               const book = await Book.findById(item.bookId);
               if (book) {
                 // المخز تم خصمه عند الإضافة للسلة، لا نحتاج لخصمه مرة أخرى
                 console.log(`✅ Book ${book.title} purchased: ${item.quantity} copies`);
               }
             }
           }
          
          // تفريغ السلة بعد الدفع الناجح
          await CartItem.deleteMany({ userId: user.id });
          console.log('✅ Cart cleared after successful payment');
          
        } catch (parseError) {
          console.error('❌ Error parsing cart items:', parseError);
        }
      }
      
      // مع React يمكن توجيه الواجهة الأمامية بعد نجاح الدفع
      res.redirect(`/payment/success?session_id=${session.id}`);
    } else {
      console.log('❌ Payment not completed, status:', session.payment_status);
      res.redirect('/cart/allCart');
    }
  } catch (error) {
    console.error('❌ Payment success error:', error);
    res.redirect('/cart/allCart');
  }
};

// ✅ إلغاء الدفع
exports.paymentCancel = (req, res) => {
  res.status(200).send('Payment canceled');
};

// ✅ Webhook للتعامل مع أحداث Stripe
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // التعامل مع الأحداث
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Payment completed via webhook:', session.id);
      
      // يمكن إضافة منطق إضافي هنا مثل:
      // - إرسال تأكيد بالبريد الإلكتروني
      // - تحديث قاعدة البيانات
      // - إرسال إشعار
      break;
      
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✅ Payment intent succeeded:', paymentIntent.id);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('❌ Payment failed:', failedPayment.id);
      break;
      
    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}; 