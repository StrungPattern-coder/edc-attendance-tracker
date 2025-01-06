const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config(); // To load environment variables from a .env file

// Models
const User = require('./models/User');
const Attendance = require('./models/Attendance');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Environment Variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Use .env in production
const PORT = process.env.PORT || 3000;

// Helper function to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // Add user data to request object
    next();
  });
};

console.log("Mongo URI: ", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
// 1. Admin Login
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  const admin = await User.findOne({ username, role: 'admin' });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT for admin
  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// 2. Member Signup
app.post('/members/signup', async (req, res) => {
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
});

// 3. Member Login
app.post('/members/login', async (req, res) => {
  const { username, password } = req.body;

  const member = await User.findOne({ username, role: 'member' });
  if (!member || !(await bcrypt.compare(password, member.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT for member
  const token = jwt.sign({ username, role: 'member' }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// 4. Mark Attendance (Admin Only)
app.post('/mark-attendance', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You are not authorized to mark attendance' });
  }

  const { scannedData } = req.body;

  const member = await User.findOne({ username: scannedData, role: 'member' });
  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  // Add attendance record
  const attendance = new Attendance({
    member: member._id,
    date: new Date(),
    status: 'Present',
  });

  await attendance.save();
  res.json({ message: 'Attendance marked successfully', attendance });
});

// 5. Get Attendance (Admin Only)
app.get('/attendance', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You are not authorized to view attendance' });
  }

  const attendanceRecords = await Attendance.find().populate('member', 'username');
  res.json(attendanceRecords);
});

// Fallback for 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});