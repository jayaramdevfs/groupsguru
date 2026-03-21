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

export default api;
