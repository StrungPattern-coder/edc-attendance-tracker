import React, { useState, useEffect } from "react";
import { fetchAttendance } from "../services/api"; // Corrected path

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const loadAttendance = async () => {
      const data = await fetchAttendance();
      setAttendance(data);
    };

    loadAttendance();
  }, []);

  return (
    <div>
      <h2>Your Attendance</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.length > 0 ? (
            attendance.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No attendance data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendancePage;