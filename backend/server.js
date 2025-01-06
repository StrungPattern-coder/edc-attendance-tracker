// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware to parse JSON bodies and allow cross-origin requests
app.use(express.json());
app.use(cors());

// Simulating a simple database (you can replace this with actual database integration)
let attendance = [
  { name: 'John Doe', status: 'Present' },
  { name: 'Jane Smith', status: 'Absent' },
];

// API route to mark attendance (simulating the marking of attendance)
app.post('/mark-attendance', (req, res) => {
  const { scannedData } = req.body;

  if (!scannedData) {
    return res.status(400).json({ message: 'No data provided' });
  }

  // Simulating marking attendance for a user by adding them to the attendance list
  const member = { name: scannedData, status: 'Present' };
  attendance.push(member);

  console.log('Marked attendance for:', scannedData);
  return res.json({ message: 'Attendance marked successfully', attendance });
});

// API route to fetch current attendance records
app.get('/attendance', (req, res) => {
  return res.json({ attendance });
});

// API route to reset attendance (for demo purposes)
app.post('/reset-attendance', (req, res) => {
  attendance = [];
  return res.json({ message: 'Attendance has been reset', attendance });
});

// Start the server on a specified port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});