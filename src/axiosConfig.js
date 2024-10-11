// axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://172.25.0.7:8080', // Set your base URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
});
// Adding an interceptor to include the token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
