const mongoose = require('mongoose');

// Attendance schema
const AttendanceSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Present',
  },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);