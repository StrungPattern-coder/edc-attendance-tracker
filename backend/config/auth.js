const jwt = require('jsonwebtoken');

// Secret key for JWT (you should move this to an environment variable in production)
const JWT_SECRET = 'your_secret_key';

// Middleware to authenticate JWT and attach the user to the request object
const authenticateJWT = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    req.user = user; // Attach the decoded user data to the request
    next(); // Call next middleware or route handler
  });
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next(); // If the user is an admin, proceed to the next middleware or route handler
};

// Middleware to check if the user is a member
const isMember = (req, res, next) => {
  if (req.user.role !== 'member') {
    return res.status(403).json({ message: 'Access denied: Members only' });
  }
  next(); // If the user is a member, proceed to the next middleware or route handler
};

// Generate JWT token for the user
const generateToken = (user) => {
  return jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

module.exports = { authenticateJWT, isAdmin, isMember, generateToken };