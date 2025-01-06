import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api"; // Updated to the correct path

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Updated to use React Router v6+ hook

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setError("Please enter both username and password.");
        return;
      }

      // Make an API call to the backend
      const response = await apiClient.post("/admin/login", { username, password });

      // Save the token to localStorage
      const token = response.data.token;
      localStorage.setItem("authToken", token);

      // Redirect to attendance page on successful login
      navigate("/attendance");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      {error && <p className="error-message">{error}</p>}
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;