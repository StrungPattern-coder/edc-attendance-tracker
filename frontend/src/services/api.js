import axios from "axios";
import { getToken } from "./auth"; // Ensure this function is defined in auth.js to get JWT from sessionStorage

const API_BASE_URL = "http://localhost:3000"; // Change this if necessary

// Create an axios instance to manage API requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add the Authorization header with the JWT token (if it exists)
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken(); // Get token from sessionStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach the token to each request
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to fetch attendance
export const fetchAttendance = async () => {
  try {
    const response = await apiClient.get("/attendance");
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data", error);
    return [];
  }
};

// Function to mark attendance
export const markAttendance = async (scannedData) => {
  try {
    const response = await apiClient.post("/mark-attendance", { scannedData });
    return response.data;
  } catch (error) {
    console.error("Error marking attendance", error);
    throw error;
  }
};

// Function to handle login
export const login = async (username, password) => {
  try {
    const response = await apiClient.post("/admin/login", { username, password });
    return response.data;
  } catch (error) {
    console.error("Error during login", error);
    throw error;
  }
};

// Function to register new user
export const signupUser = async (userData) => {
  try {
    const response = await apiClient.post("/admin/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Error during signup", error);
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export default apiClient;