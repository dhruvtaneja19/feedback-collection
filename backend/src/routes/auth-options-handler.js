// routes/auth-options-handler.js
// Simple middleware to properly handle OPTIONS requests for auth routes

const handleOptions = (req, res) => {
  // Get the origin from request headers
  const origin = req.headers.origin;

  // Set specific origin instead of wildcard
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

  console.log(`✅ Auth OPTIONS handler for: ${req.path}`);
  console.log(`✅ Origin: ${origin || "No origin header"}`);

  res.status(200).end();
};

export default handleOptions;
