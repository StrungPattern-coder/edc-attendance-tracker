const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model to check the members
const Attendance = require('../models/Attendance'); // Assuming you have an Attendance model to store attendance data
const router = express.Router();

// Mark attendance (Admin only)
router.post('/mark-attendance', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Decode the JWT token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken); // Check what data is inside the token

        // Verify the user exists in the database
        const user = await User.findOne({ username: decodedToken.username });
        if (!user) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Check if the logged-in user is an admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to mark attendance' });
        }

        // Assuming you are sending the member's username and event ID to mark attendance
        const { memberUsername, eventId } = req.body;

        // Find the member and mark their attendance
        const member = await User.findOne({ username: memberUsername });
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Create attendance entry
        const attendance = new Attendance({
            member: member._id,
            event: eventId,
            date: new Date(),
        });

        await attendance.save();

        return res.status(200).json({ message: 'Attendance marked successfully' });

    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
});

module.exports = router;