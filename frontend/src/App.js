import React, { useState } from "react";
import QRCodeScanner from "react-qr-scanner"; // QR scanner library
import { useNavigate } from "react-router-dom";
import "./App.css"; // Import your existing CSS
import { fetchAttendance } from "./services/api"; // Import API function

function App() {
  const [attendance, setAttendance] = useState([]);
  const [theme, setTheme] = useState("light"); // Example theme state
  const navigate = useNavigate(); // For redirecting

  const handleScan = async (data) => {
    if (data) {
      try {
        // API call to mark attendance
        const response = await fetch("http://localhost:3000/mark-attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scannedData: data.text }), // Assuming QR code data contains user ID or event info
        });

        if (response.ok) {
          console.log("Attendance marked successfully");
          const result = await response.json();
          setAttendance(result.attendance); // Update attendance records from the API
        } else {
          console.error("Error marking attendance");
        }
      } catch (error) {
        console.error("Error connecting to backend:", error);
      }
    }
  };

  const handleError = (err) => {
    console.error("Scanner error:", err);
  };

  return (
    <div className={`App ${theme}`}>
      <h1>Admin Dashboard</h1>
      <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
      <QRCodeScanner onScan={handleScan} onError={handleError} />

      <div>
        <h3>Attendance Records</h3>
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((entry, index) => (
              <tr key={index}>
                <td>{entry.name}</td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;