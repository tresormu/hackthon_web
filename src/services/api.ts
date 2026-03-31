import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:4000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const isPublic = config.url?.includes("/auth/login") || config.url?.includes("/auth/register");
    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Skip clearing auth for the /auth/me validation call itself
      const isAuthMe = error.config?.url?.includes('/auth/me');
      if (!isAuthMe) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(error);
  },
);

export default api;
