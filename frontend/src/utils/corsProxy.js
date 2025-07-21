// corsProxy.js
// A simple function to handle CORS issues by using a proxy or direct calls based on environment

/**
 * Creates a CORS-friendly URL for API requests
 * @param {string} endpoint - The API endpoint (should start with /)
 * @returns {string} The complete URL with proper CORS handling
 */
export const createApiUrl = (endpoint) => {
  // Make sure endpoint starts with /
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Check if we're in development or production
  const isDev = import.meta.env.DEV;

  // Special handling for all auth endpoints to avoid CORS issues
  if (path.includes("/api/auth/")) {
    console.log(`🔐 Auth endpoint detected: ${path}`);

    if (isDev) {
      console.log("🔐 Using local proxy for auth in development");
      return path; // Use local proxy in development
    } else {
      // In production, use direct URL to backend
      const authUrl = "https://feedback-collection-t8g8.vercel.app" + path;
      console.log(
        `🔐 Using direct backend URL for auth in production: ${authUrl}`
      );
      return authUrl;
    }
  }

  // For other endpoints
  if (isDev) {
    // In development, proxy is already set up in Vite config, so just use relative URL
    return path;
  } else {
    // In production, use the complete API URL from environment variable
    const apiBase =
      import.meta.env.VITE_API_URL ||
      "https://feedback-collection-t8g8.vercel.app";

    // Clean up the URL to avoid double slashes
    const baseWithoutTrailingSlash = apiBase.endsWith("/")
      ? apiBase.slice(0, -1)
      : apiBase;

    return `${baseWithoutTrailingSlash}${path}`;
  }
};

/**
 * Creates headers for API requests
 * @param {string} url - The URL of the request  
 * @returns {Object} Headers object
 */
export const createCorsHeaders = (url = "") => {
  // Only set Content-Type header - CORS headers are handled by the server
  const headers = {
    "Content-Type": "application/json",
  };

  console.log(`� Using standard headers for: ${url}`);
  return headers;
};
