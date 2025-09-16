const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: 'No description provided' },
  stock: { type: Number, default: 1, min: 0 },
  image: { type: String, default: '/assets/img/products-01.png' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
