import axios from "axios";

const API_BASE_URL = "http://10.11.155.243:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // important for HttpOnly cookie
  headers: {
    "Content-Type": "application/json",
  },
});