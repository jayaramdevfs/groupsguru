import axios from "axios";

// Uses ADB reverse port forwarding: `adb reverse tcp:8080 tcp:8080`
// For physical device via USB, localhost works with adb reverse
const API_BASE_URL = "http://localhost:8080";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Bearer token to every request (mobile can't use HttpOnly cookies)
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});
