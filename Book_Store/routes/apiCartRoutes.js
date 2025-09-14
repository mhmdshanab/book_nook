const express = require('express');
const router = express.Router();
const cart = require('../controllers/cartController');
const { requireAuthApi } = require('../middleware/authMiddleware');

router.get('/', requireAuthApi, cart.getCartApi);
// توافق مع الفرونت: السماح بـ POST /api/cart لإضافة عنصر
router.post('/', requireAuthApi, cart.addToCartApi);
router.post('/add', requireAuthApi, cart.addToCartApi);
router.post('/increase/:id', requireAuthApi, cart.increaseQuantityApi);
router.post('/decrease/:id', requireAuthApi, cart.decreaseQuantityApi);
router.delete('/item/:id', requireAuthApi, cart.removeFromCartApi);
router.post('/empty', requireAuthApi, cart.emptyCartApi);
router.put('/item/:id', requireAuthApi, cart.setQuantityApi);

module.exports = router;


