import axios from "axios";
import { getToken } from "./auth"; // Import the getToken function from auth.js

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
    const token = getToken(); // Get token from localStorage
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
    return [];
  }
};

// You can add more API functions here as needed

export default apiClient;