import React, { useState, useEffect, Suspense } from "react";
import QRCodeScanner from "react-qr-scanner";
import { useNavigate, Link, Routes, Route } from "react-router-dom";
import "./App.css";
import { fetchAttendance, markAttendance } from "./services/api";
import "react-toastify/dist/ReactToastify.css";

// Lazy load the Signup component
const Signup = React.lazy(() => import("./Signup"));
const UserDashboard = React.lazy(() => import("./UserDashboard"));
const AdminDashboard = React.lazy(() => import("./AdminDashboard"));
const { ToastContainer, toast } = require('react-toastify');

// Create a separate component for the main dashboard
function Dashboard({ theme, setTheme, attendance, handleScan, handleError, isLoading, error, isAdmin }) {
  return (
    <div className={`App ${theme}`}>
      <h1>{isAdmin ? "Admin Dashboard" : "User Dashboard"}</h1>

      <nav className="navigation">
        <Link to="/signup" className="signup-link">Don't have an account? Signup here</Link>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>

      {isAdmin ? (
        <div className="qr-scanner-container">
          <h3>Scan QR Code</h3>
          <QRCodeScanner
            onScan={handleScan}
            onError={handleError}
            style={{ width: '100%' }}
          />
        </div>
      ) : (
        <div className="attendance-section">
          <h3>Your Attendance Records</h3>
          {isLoading && (
            <div className="loading">Loading attendance records...</div>
          )}

          {error && (
            <div className="error">Error: {error}</div>
          )}

          {!isLoading && !error && (
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="no-records">No records found.</td>
                  </tr>
                ) : (
                  attendance.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.name}</td>
                      <td>
                        <span className={`status ${entry.status.toLowerCase()}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td>{new Date(entry.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  const [attendance, setAttendance] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || "light");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // New state to check if the user is an admin

  useEffect(() => {
    // Apply theme to body element
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAttendance();
        setAttendance(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setError("Failed to load attendance data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleScan = async (data) => {
    if (data) {
      try {
        const response = await markAttendance(data.text);
        if (response.success) {
          toast.success("Attendance marked successfully!");
          const updatedAttendance = await fetchAttendance();
          setAttendance(updatedAttendance.data);
        } else {
          toast.error("Error marking attendance");
        }
      } catch (error) {
        toast.error("Failed to mark attendance");
      }
    }
  };

  const handleError = (err) => {
    console.error("Scanner error:", err);
    if (err.name === "NotAllowedError") {
      setError("Permission denied. Please allow camera access.");
    } else if (err.name === "NotFoundError") {
      setError("No camera found. Please check your device.");
    } else {
      setError("QR Scanner error: " + err.message);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              theme={theme}
              setTheme={setTheme}
              attendance={attendance}
              handleScan={handleScan}
              handleError={handleError}
              isLoading={isLoading}
              error={error}
              isAdmin={isAdmin}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Signup />
            </Suspense>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <UserDashboard />
            </Suspense>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminDashboard />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}

export default App;