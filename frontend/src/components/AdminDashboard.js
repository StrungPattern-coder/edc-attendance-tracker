// src/components/AdminDashboard.js
import React, { useState } from "react";
import QrReader from "react-qr-scanner"; // Correct import for react-qr-scanner

const AdminDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [scanResult, setScanResult] = useState(""); // Store scanned result
  const [error, setError] = useState(""); // Error state for API calls

  // Handle the scanned QR code data
  const handleScan = async (data) => {
    if (data) {
      const scannedData = data.text; // Extract scanned data
      console.log("Scanned data:", scannedData);
      setScanResult(scannedData); // Update the scanned result

      try {
        // Send the scanned data to the backend API
        const response = await fetch("/api/mark-attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qrData: scannedData }), // Payload
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Attendance marked successfully:", result);

          // Update attendance state with response data
          setAttendance((prev) => [
            ...prev,
            { name: result.name, status: result.status },
          ]);
        } else {
          console.error("Failed to mark attendance. Status:", response.status);
          setError(`Failed to mark attendance. Try again.`);
        }
      } catch (err) {
        console.error("Error during API call:", err);
        setError("An error occurred while marking attendance. Please try again.");
      }
    }
  };

  // Handle QR scanner errors
  const handleError = (err) => {
    console.error("Scanner error:", err);
    setError("An error occurred with the QR scanner.");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {/* QR Code Scanner */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Scan QR Code</h3>
        <QrReader
          delay={300}
          style={{ width: "100%" }}
          onError={handleError}
          onScan={handleScan}
        />
        {scanResult && <p>Scanned Result: {scanResult}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* Attendance Records */}
      <div>
        <h3>Attendance Records</h3>
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Member</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="2">No attendance records yet.</td>
              </tr>
            ) : (
              attendance.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.name}</td>
                  <td>{entry.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;