const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating tokens
require('dotenv').config(); // To load environment variables from a .env file (useful for JWT secret)

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Environment Variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Use .env in production
const PORT = process.env.PORT || 3000;

// In-memory database for now (replace with a real database)
let admins = [{ username: 'admin', password: bcrypt.hashSync('adminPass123', 10) }];
let members = []; // Will hold member/guest accounts
let attendanceRecords = []; // To store attendance data

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

// Routes
// 1. Admin Login
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  const admin = admins.find((a) => a.username === username);
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

  if (members.find((m) => m.username === username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  members.push({ username, password: hashedPassword });
  res.json({ message: 'Signup successful' });
});

// 3. Member Login
app.post('/members/login', async (req, res) => {
  const { username, password } = req.body;

  const member = members.find((m) => m.username === username);
  if (!member || !(await bcrypt.compare(password, member.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT for member
  const token = jwt.sign({ username, role: 'member' }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// 4. Mark Attendance (Admin Only)
app.post('/mark-attendance', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You are not authorized to mark attendance' });
  }

  const { scannedData } = req.body;

  // Example: Mark attendance for a member based on the scanned data
  const member = members.find((m) => m.username === scannedData);
  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  // Add attendance record (you could add more details like date/time)
  attendanceRecords.push({ member: member.username, status: 'Present' });
  res.json({ message: 'Attendance marked successfully', attendance: attendanceRecords });
});

// 5. Get Attendance (Admin Only)
app.get('/attendance', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You are not authorized to view attendance' });
  }

  res.json(attendanceRecords);
});

// 6. Protected Route Example
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({
    message: `Hello ${req.user.username}, welcome to the protected route!`,
    role: req.user.role,
  });
});

// Fallback for 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});