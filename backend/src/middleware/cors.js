// middleware/cors.js
// Enhanced CORS middleware to handle preflight requests and provide more detailed logging

const corsMiddleware = (req, res, next) => {
  // Set CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");

  // Log request details for debugging
  console.log(`📝 CORS Request: ${req.method} ${req.url}`);
  console.log(`📝 Origin: ${req.headers.origin}`);
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("✅ Handling OPTIONS preflight request");
    return res.status(200).end();
  }
  
  next();
};

export default corsMiddleware;
