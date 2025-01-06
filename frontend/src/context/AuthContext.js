import React, { createContext, useContext, useState, useEffect } from "react";
import { isLoggedIn, login, logout } from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(isLoggedIn());

  useEffect(() => {
    setAuthenticated(isLoggedIn());
  }, []);

  const loginUser = async (username, password) => {
    const token = await login(username, password);
    if (token) {
      setAuthenticated(true);
    }
    return token;
  };

  const logoutUser = () => {
    logout();
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};