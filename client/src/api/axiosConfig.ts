import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/Restaurant",
  timeout: 10000,
});

// Request interceptor to automatically add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired or invalid
      console.warn("Authentication failed - token may be expired");
      // Optionally clear invalid token
      // localStorage.removeItem("authToken");
      // localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
