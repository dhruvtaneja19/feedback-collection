// corsProxy.js
// A simple function to handle CORS issues by using a proxy or direct calls based on environment

/**
 * Creates a CORS-friendly URL for API requests
 * @param {string} endpoint - The API endpoint (should start with /)
 * @returns {string} The complete URL with proper CORS handling
 */
export const createApiUrl = (endpoint) => {
  // Make sure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Check if we're in development or production
  const isDev = import.meta.env.DEV;
  
  if (isDev) {
    // In development, proxy is already set up in Vite config, so just use relative URL
    return path;
  } else {
    // In production, use the complete API URL from environment variable
    const apiBase = import.meta.env.VITE_API_URL || 'https://feedback-collection-t8g8-dhruv-tanejas-projects.vercel.app';
    
    // Clean up the URL to avoid double slashes
    const baseWithoutTrailingSlash = apiBase.endsWith('/') 
      ? apiBase.slice(0, -1) 
      : apiBase;
    
    return `${baseWithoutTrailingSlash}${path}`;
  }
};

/**
 * Creates headers with CORS support
 * @returns {Object} Headers object with CORS configuration
 */
export const createCorsHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
};
