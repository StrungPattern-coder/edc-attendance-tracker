import axios from "axios";

// Backend API base URL (in case you need to modify it later)
const API_BASE_URL = "http://localhost:3000"; // Change this if necessary

// Function to log in and get a JWT token
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, { username, password });
    // Store the JWT token in sessionStorage for the current session
    sessionStorage.setItem("token", response.data.token);
    return response.data.token; // Return the token for use (if needed)
  } catch (error) {
    console.error("Login failed", error); // Log any error during the login process
    return null; // Return null if login failed
  }
};

// Function to check if the user is logged in by checking if a token exists in sessionStorage
export const isLoggedIn = () => {
  const token = sessionStorage.getItem("token");
  return token ? true : false; // Return true if token exists, false otherwise
};

// Function to get the stored JWT token from sessionStorage
export const getToken = () => {
  return sessionStorage.getItem("token");
};

// Function to log out by removing the token from sessionStorage
export const logout = () => {
  sessionStorage.removeItem("token");
  console.log("Logged out successfully");
};