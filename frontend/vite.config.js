import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Determine if we're building for production
  const isProd = mode === "production";

  // Set the appropriate API URL based on environment
  const apiUrl = isProd
    ? "https://feedback-collection-t8g8-dhruv-tanejas-projects.vercel.app"
    : "http://localhost:5000";

  console.log(`Using API URL: ${apiUrl} for mode: ${mode}`);

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: isProd, // Use secure for production
          cors: true,
          rewrite: (path) => path,
          configure: (proxy, options) => {
            // Add specific CORS configuration
            proxy.on("proxyRes", (proxyRes, req, res) => {
              // Use the current origin or the default one
              const origin = req.headers.origin || "http://localhost:3000";
              proxyRes.headers["Access-Control-Allow-Origin"] = origin;
              proxyRes.headers["Access-Control-Allow-Credentials"] = "false";
            });
          },
        },
      },
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        // Ensure proper handling of environment variables in production
        external: [],
      },
    },
    define: {
      // Provide fallback values for environment variables
      __APP_ENV__: JSON.stringify(process.env.APP_ENV || "production"),
    },
  };
});
