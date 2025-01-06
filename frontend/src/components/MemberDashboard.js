import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { isAuthenticated, logout } from "../services/auth"; // Import helper functions for authentication
import apiClient from "../api/api"; // Axios instance for API calls

const MemberDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const history = useHistory();

  // Fetch attendance data when the component mounts
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login page if not authenticated
      history.push("/login");
    } else {
      fetchAttendance();
    }
  }, [history]);

  const fetchAttendance = async () => {
    try {
      const response = await apiClient.get("/attendance", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Send JWT in the request header
        },
      });
      setAttendance(response.data.attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error.response ? error.response.data : error);
    }
  };

  const handleLogout = () => {
    logout();
    history.push("/login");
  };

  return (
    <div className="dashboard-container">
      <h2>Member Dashboard</h2>
      <div className="attendance-section">
        <h3>Your Attendance:</h3>
        <ul>
          {attendance.length > 0 ? (
            attendance.map((entry, index) => (
              <li key={index}>
                {entry.name} - {entry.status}
              </li>
            ))
          ) : (
            <p>No attendance data available</p>
          )}
        </ul>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default MemberDashboard;