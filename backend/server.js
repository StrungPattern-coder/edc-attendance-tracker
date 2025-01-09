const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
require('dotenv').config(); // Load environment variables from a .env file

// Import Models
const User = require('./models/User');
const Attendance = require('./models/Attendance');

// Import Database Connection
const connectDB = require('./config/db');

// Initialize App
const app = express();

// Middleware
app.use(express.json({ limit: '10kb' })); // Limit body size for security
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers

// Environment Variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Fallback for development
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Helper Function: Authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user; // Attach user data to request
    next();
  });
};

// Routes
// 1. Admin Login
app.post('/admin/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await User.findOne({ username, role: 'admin' });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
});

// 2. Member Signup
app.post('/members/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role: 'member' });
    await newUser.save();
    res.json({ message: 'Signup successful' });
  } catch (error) {
    next(error);
  }
});

// 3. Member Login
app.post('/members/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const member = await User.findOne({ username, role: 'member' });
    if (!member || !(await bcrypt.compare(password, member.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ username, role: 'member' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
});

// 4. Mark Attendance (Admin Only)
app.post('/mark-attendance', authenticateJWT, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to mark attendance' });
    }

    const { scannedData } = req.body;

    const member = await User.findOne({ username: scannedData, role: 'member' });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Add Attendance Record
    const attendance = new Attendance({
      member: member._id,
      date: new Date(),
      status: 'Present',
    });

    await attendance.save();
    res.json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    next(error);
  }
});

// 5. Get Attendance (Admin Only)
app.get('/attendance', authenticateJWT, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to view attendance' });
    }

    const attendanceRecords = await Attendance.find().populate('member', 'username');
    res.json(attendanceRecords);
  } catch (error) {
    next(error);
  }
});

// Fallback for 404 Routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  res.status(500).json({ message: 'An error occurred', error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});