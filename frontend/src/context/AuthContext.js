import React, { createContext, useContext, useState, useEffect } from "react";
import { isLoggedIn, login, logout } from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(isLoggedIn());
  const [role, setRole] = useState(sessionStorage.getItem("role") || "guest");

  useEffect(() => {
    setAuthenticated(isLoggedIn());
    const storedRole = sessionStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const loginUser = async (username, password) => {
    const token = await login(username, password);
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      setRole(decoded.role); // Set the role from the decoded token
      sessionStorage.setItem("token", token); // Store token
      sessionStorage.setItem("role", decoded.role); // Store role
      setAuthenticated(true);
    }
    return token;
  };

  const logoutUser = () => {
    logout();
    setAuthenticated(false);
    setRole("guest");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ authenticated, role, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};