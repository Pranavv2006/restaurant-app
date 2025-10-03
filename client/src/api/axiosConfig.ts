import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/Restaurant",
  timeout: 10000,
});

export default axiosInstance;
