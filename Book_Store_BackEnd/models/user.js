const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true, trim: true },
  password:  { type: String, required: true },
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  isAdmin:   { type: Boolean, default: false }
}, {
  timestamps: true // ✅ تسجيل وقت الإنشاء والتحديث
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
