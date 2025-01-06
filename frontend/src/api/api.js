import axios from 'axios';

// Create an Axios instance for API calls
const apiClient = axios.create({
    baseURL: 'http://localhost:3000', // Replace with your backend URL if needed
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the Authorization header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Fetch token from localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Add token to headers
        }
        return config;
    },
    (error) => {
        return Promise.reject(error); // Handle request errors
    }
);

// Add a response interceptor for centralized error handling
apiClient.interceptors.response.use(
    (response) => {
        return response; // Pass successful responses
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized: Please log in again.');
            // Optional: Redirect to login page or clear localStorage
            localStorage.removeItem('authToken');
            window.location.href = '/login'; // Adjust route as per your app
        }
        return Promise.reject(error); // Pass errors for further handling
    }
);

export default apiClient;