import axios from "axios";

// Backend API base URL
const API_BASE_URL = "http://localhost:3000"; // Change this if necessary

// Function to log in and get a JWT token
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, { username, password });
    localStorage.setItem("token", response.data.token); // Store the token in localStorage
    return response.data.token;
  } catch (error) {
    console.error("Login failed", error);
    return null; // Return null if login failed
  }
};

// Function to check if the user is logged in (by checking for token in localStorage)
export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return token ? true : false;
};

// Function to get the stored token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Function to log out (remove token from localStorage)
export const logout = () => {
  localStorage.removeItem("token");
};