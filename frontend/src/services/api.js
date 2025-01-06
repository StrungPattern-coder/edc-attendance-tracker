import axios from "axios";
import { getToken } from "./auth"; // Ensure this function is defined in auth.js to get JWT from localStorage

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
    const token = getToken(); // Get token from localStorage (getToken should be defined in auth.js)
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach the token to each request
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to fetch attendance (example API endpoint)
export const fetchAttendance = async () => {
  try {
    const response = await apiClient.get("/attendance");
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data", error);
    return []; // Return an empty array in case of an error
  }
};

// Function to mark attendance (example API endpoint)
export const markAttendance = async (scannedData) => {
  try {
    const response = await apiClient.post("/mark-attendance", { scannedData });
    return response.data;
  } catch (error) {
    console.error("Error marking attendance", error);
    throw error; // Throw error for handling in the calling component
  }
};

// Function to handle login (example API endpoint)
export const login = async (username, password) => {
  try {
    const response = await apiClient.post("/admin/login", { username, password });
    return response.data;
  } catch (error) {
    console.error("Error during login", error);
    throw error; // Throw error for handling in the calling component
  }
};

// Function to register new user (signup)
export const register = async (userData) => {
  try {
    const response = await apiClient.post("/admin/signup", userData); // Assuming your backend has this route
    return response.data;
  } catch (error) {
    console.error("Error during registration", error);
    throw error; // Throw error for handling in the calling component
  }
};

// You can add more API functions here as needed

export default apiClient;