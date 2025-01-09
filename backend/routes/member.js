const express = require("express");
const router = express.Router();
const Member = require("../models/member");
const Attendance = require("../models/Attendance");
const { verifyAdmin, verifyUser } = require("../middleware/auth");

// Route to fetch attendance records
router.get("/attendance", verifyUser, async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().populate("member", "name");
    res.status(200).json({ success: true, data: attendanceRecords });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ success: false, message: "Failed to fetch attendance records" });
  }
});

// Route to mark attendance
router.post("/mark-attendance", verifyAdmin, async (req, res) => {
  const { registrationNumber } = req.body;
  try {
    const member = await Member.findOne({ registrationNumber });
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    const existingAttendance = await Attendance.findOne({ member: member._id, date: new Date().toLocaleDateString() });
    if (existingAttendance) {
      return res.status(400).json({ success: false, message: "Attendance already marked for today" });
    }

    const attendance = new Attendance({
      member: member._id,
      status: "Present",
      timestamp: new Date(),
      date: new Date().toLocaleDateString()
    });
    
    await attendance.save();
    res.status(200).json({ success: true, message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ success: false, message: "Failed to mark attendance" });
  }
});

// Route to get member details (for the dashboard)
router.get("/member/:id", verifyUser, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    console.error("Error fetching member details:", error);
    res.status(500).json({ success: false, message: "Failed to fetch member details" });
  }
});

// Route to handle user signup (admin creates users)
router.post("/signup", verifyAdmin, async (req, res) => {
  const { name, registrationNumber, email, password } = req.body;
  try {
    const existingMember = await Member.findOne({ registrationNumber });
    if (existingMember) {
      return res.status(400).json({ success: false, message: "Member already exists" });
    }

    const newMember = new Member({
      name,
      registrationNumber,
      email,
      password
    });

    await newMember.save();
    res.status(201).json({ success: true, message: "Member created successfully" });
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ success: false, message: "Failed to create member" });
  }
});

module.exports = router;