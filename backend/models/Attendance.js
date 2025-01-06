const mongoose = require('mongoose');

// Attendance schema
const AttendanceSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model (representing the member)
    required: true,
  },
  event: {
    type: String,  // Store event name (can be a reference to another collection if you create an Event model)
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,  // Automatically sets the date of attendance
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],  // Status options
    default: 'Present',
  },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);