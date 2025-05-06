const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.error('Token not found in cookies or Authorization header');
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Decoded Token:', decoded);

    // Attach user info to the request object
    req.user = {
      _id: decoded.id,
      fullname: decoded.fullname,
      email: decoded.email,
      role: decoded.role,
    };

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
