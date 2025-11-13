import axios from "axios";

// Base axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend ka base path
});

// Add token automatically (if logged in)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH APIs
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// Test API (optional)
export const getTestData = () => API.get("/test");

export default API;
