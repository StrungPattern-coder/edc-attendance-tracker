import React, { useEffect, useState } from "react";
import { fetchUserAttendanceStats } from "../services/api"; // Assuming you have a function for fetching attendance stats

const UserDashboard = () => {
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user attendance stats from backend
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetchUserAttendanceStats(); // Adjust API call as needed
        setAttendanceStats(response.data); // Adjust to your API response format
      } catch (err) {
        setError("Failed to fetch attendance stats.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Dashboard</h2>
      
      {isLoading && <p>Loading attendance statistics...</p>}
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {!error && !isLoading && (
        <div>
          <h3>Your Attendance Statistics</h3>
          <table border="1" style={{ width: "100%", textAlign: "left", marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Event</th>
                <th>Status</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attendanceStats.length === 0 ? (
                <tr>
                  <td colSpan="3">No attendance data available.</td>
                </tr>
              ) : (
                attendanceStats.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.event}</td>
                    <td>{entry.status}</td>
                    <td>{entry.percentage}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;