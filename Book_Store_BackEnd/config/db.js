// config/db.js
const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // لمنع التحذير

const connectDB = async () => {
  try {
    //|| 'mongodb://127.0.0.1:27017/book_store'
    const mongoURI = process.env.MONGODB_URI ;
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
    console.log(`📍 Database: ${mongoURI.includes('mongodb.net') ? 'MongoDB Atlas (Production)' : 'Local MongoDB'}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
