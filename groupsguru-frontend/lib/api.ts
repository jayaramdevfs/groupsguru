import axios from "axios";

const api = axios.create({
  // Uses Next.js rewrites proxy — /api/* → localhost:8080/api/*
  // This keeps cookies same-origin (no cross-origin cookie issues)
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if token expired/invalid
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
