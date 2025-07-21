import axios from "axios";
import { createApiUrl, createCorsHeaders } from "./corsProxy";

// Safely access environment variables
const getEnvVar = (key) => {
  try {
    return import.meta.env[key];
  } catch (e) {
    return undefined;
  }
};

// Determine if we're in development or production
const isDev = getEnvVar("DEV") === true;

// Safely log debug information
try {
  console.log("🔗 Environment:", isDev ? "development" : "production");
} catch (e) {
  console.log("Could not log environment information");
}

// Determine the API URL - in both cases, we'll use the proxy from Vite
// In development, it proxies through to localhost:5000
// In production, it proxies to the actual backend URL configured in vite.config.js
const API_URL = '';  // Empty means use relative URLs which will go through Vite's proxy

// Create an axios instance with default configuration and CORS handling
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Don't use credentials mode since we're using token auth
  withCredentials: false,
});

// Add a request interceptor to include auth token and handle CORS
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CORS headers
    Object.assign(config.headers, createCorsHeaders());
    
    // Transform the URL to handle CORS issues
    if (config.url) {
      // Only transform non-absolute URLs
      if (!config.url.startsWith('http')) {
        config.url = createApiUrl(config.url);
      }
    }
    
    console.log(`🔄 Request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
