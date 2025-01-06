import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api"; // Import the register function

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      if (!username || !password) {
        setError("Please enter both username and password.");
        return;
      }

      // Make an API call to the backend for signup
      const response = await register({ username, password });

      // On successful signup, notify the user
      setSuccess("Signup successful! You can now log in.");
      setError(""); // Clear any previous error

      // Redirect to login page after success (optional)
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Delay for user to see success message
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
      setSuccess(""); // Clear any previous success message
    }
  };

  return (
    <div className="signup-container">
      <h2>Member Signup</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default SignupPage;