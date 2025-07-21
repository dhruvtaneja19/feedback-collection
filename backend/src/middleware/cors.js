// middleware/cors.js
// Enhanced CORS middleware to handle preflight requests and provide more detailed logging

const corsMiddleware = (req, res, next) => {
  // Get the origin from request headers
  const origin = req.headers.origin;

  // Set specific origin instead of wildcard for credentials mode
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "false");

  // Log request details for debugging
  console.log(`📝 CORS Request: ${req.method} ${req.url}`);
  console.log(`📝 Origin: ${origin || "No origin header"}`);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("✅ Handling OPTIONS preflight request");
    return res.status(200).end();
  }

  next();
};

export default corsMiddleware;
