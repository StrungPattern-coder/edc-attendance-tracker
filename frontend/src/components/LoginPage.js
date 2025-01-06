import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth"; // Import login function from auth.js

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setError("Please enter both username and password.");
        return;
      }

      const token = await login(username, password);

      if (token) {
        navigate("/attendance"); // Redirect to the attendance page if login is successful
      } else {
        setError("Invalid username or password");
      }
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