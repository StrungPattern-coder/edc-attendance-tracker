import React, { useState, useEffect } from "react";
import QRCodeScanner from "react-qr-scanner";
import { useNavigate, Link, Routes, Route } from "react-router-dom";
import "./App.css";
import { fetchAttendance, markAttendance } from "./services/api";

// Create a separate component for the main dashboard
function Dashboard({ theme, setTheme, attendance, handleScan, handleError, isLoading, error }) {
  return (
    <div className={`App ${theme}`}>
      <h1>Admin Dashboard</h1>
      
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

      <div className="qr-scanner-container">
        <h3>Scan QR Code</h3>
        <QRCodeScanner 
          onScan={handleScan} 
          onError={handleError}
          style={{ width: '100%' }}
        />
      </div>

      <div className="attendance-section">
        <h3>Attendance Records</h3>
        
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
    </div>
  );
}

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Implement your signup API call here
      // const response = await signupUser(formData);
      // if (response.success) {
      //   navigate('/');
      // }
      console.log('Signup form submitted:', formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Sign Up</button>
      </form>

      <Link to="/" className="back-link">Back to Dashboard</Link>
    </div>
  );
}

function App() {
  const [attendance, setAttendance] = useState([]);
  const [theme, setTheme] = useState("light");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
          console.log("Attendance marked successfully");
          const updatedAttendance = await fetchAttendance();
          setAttendance(updatedAttendance.data);
        } else {
          setError("Error marking attendance");
        }
      } catch (error) {
        console.error("Error connecting to backend:", error);
        setError("Failed to mark attendance");
      }
    }
  };

  const handleError = (err) => {
    console.error("Scanner error:", err);
    setError("QR Scanner error: " + err.message);
  };

  return (
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
          />
        }
      />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;