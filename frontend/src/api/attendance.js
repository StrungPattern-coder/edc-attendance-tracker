import apiClient from './api';

export const getAttendance = async () => {
    const response = await apiClient.get('/attendance');
    return response.data;
};

export const markAttendance = async (scannedData) => {
    const response = await apiClient.post('/mark-attendance', { scannedData });
    return response.data;
};

export const resetAttendance = async () => {
    const response = await apiClient.post('/reset-attendance');
    return response.data;
};