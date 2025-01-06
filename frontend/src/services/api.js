// src/services/api.js
import axios from "axios";

const API_BASE_URL = "https://your-backend-api-url.com";

export const fetchAttendance = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/attendance`);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data", error);
    return [];
  }
};