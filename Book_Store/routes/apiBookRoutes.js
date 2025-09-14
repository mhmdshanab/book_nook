const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { requireAuthApi, requireAdminApi } = require('../middleware/authMiddleware');
const { uploadSingleImage, handleUploadError } = require('../middleware/uploadMiddleware');

router.get('/', bookController.getAllBooksApi);
router.get('/:id', bookController.getBookByIdApi);
router.post('/', requireAdminApi, uploadSingleImage, handleUploadError, bookController.createBookApi);
router.put('/:id', requireAdminApi, uploadSingleImage, handleUploadError, bookController.updateBookApi);
router.delete('/:id', requireAdminApi, bookController.deleteBookApi);

module.exports = router;


