import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/Restaurant",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes("/login") ||
        originalRequest.url?.includes("/register") ||
        originalRequest.url?.includes("/refresh-token")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.log("No refresh token available, logging out");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        console.log("Attempting to refresh token...");

        const response = await axios.post(
          "http://localhost:3000/Restaurant/auth/refresh-token",
          {
            refreshToken: refreshToken,
          }
        );

        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          console.log("Token refreshed successfully");

          localStorage.setItem("authToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          processQueue(null, accessToken);

          return axiosInstance(originalRequest);
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        processQueue(refreshError as Error, null);

        window.location.href = "/";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
