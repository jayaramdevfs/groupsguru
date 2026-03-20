import axios from "axios";

// Uses ADB reverse port forwarding: `adb reverse tcp:8080 tcp:8080`
// For physical device via USB, localhost works with adb reverse
// For emulator, use 10.0.2.2 instead
const API_BASE_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // important for HttpOnly cookie
  headers: {
    "Content-Type": "application/json",
  },
});