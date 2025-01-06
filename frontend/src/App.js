import React, { useState, useEffect } from "react";
import QRCodeScanner from "react-qr-scanner"; // QR scanner library
import { useNavigate, Link } from "react-router-dom"; // Added Link for Signup
import "./App.css"; // Import your existing CSS
import { fetchAttendance, markAttendance } from "../services/api"; // Import API functions

function App() {
  const [attendance, setAttendance] = useState([]);
  const [theme, setTheme] = useState("light"); // Example theme state
  const navigate = useNavigate(); // For redirecting

  useEffect(() => {
    // Fetch attendance records from API when the component is mounted
    const fetchData = async () => {
      try {
        const response = await fetchAttendance();
        setAttendance(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchData();
  }, []);

  const handleScan = async (data) => {
    if (data) {
      try {
        // API call to mark attendance
        const response = await markAttendance(data.text);

        if (response.success) {
          console.log("Attendance marked successfully");
          const updatedAttendance = await fetchAttendance();
          setAttendance(updatedAttendance.data); // Update attendance records from the API
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
      
      {/* Signup Link */}
      <Link to="/signup">Don't have an account? Signup here</Link>

      <button
        className="theme-toggle"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
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