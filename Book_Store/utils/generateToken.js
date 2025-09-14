// utils/generateToken.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

function generateToken(user, expiresIn = '1h') {
  if (!user || !user._id || !user.username) {
    throw new Error('Invalid user data');
  }

  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin || false
    },
    JWT_SECRET,
    { expiresIn }
  );
}

module.exports = generateToken;
