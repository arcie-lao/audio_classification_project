const jwtHelper = require('../utils/jwtHelper');
const User = require('../models/userModel');

const adminMiddleware = async (req, res, next) => { 
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Session token missing' });

  try {
    const verified = jwtHelper.verifyToken(token);
    const user = await User.getUserByEmail(verified.email);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid session token' });
  }
};

module.exports = adminMiddleware;
