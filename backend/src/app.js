import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import corsMiddleware from "./middleware/cors.js";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import feedbackRoutes from "./routes/feedback.js";
import adminRoutes from "./routes/admin.js";

// Import database connection
import connectDB from "./config/database.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite dev server
  "http://localhost:5000",
  "https://feedback-collection-1fzp.vercel.app",
  "https://feedback-collection-1fzp-fefhlkq7r-dhruv-tanejas-projects.vercel.app",
  "https://feedback-collection-1fzp-3fvossmga-dhruv-tanejas-projects.vercel.app",
  "https://feedback-collection-1fzp-nt4gdy9lu-dhruv-tanejas-projects.vercel.app",
  "https://feedback-collection-1fzp-2idvvz3fc-dhruv-tanejas-projects.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean); // Remove undefined values

// Use both built-in cors and our custom middleware for better handling
app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  })
);

// Apply our custom CORS middleware for detailed logging and better preflight handling
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

// Root route for testing
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Feedback Collection API is running",
    timestamp: new Date().toISOString(),
    routes: ["/api/auth", "/api/users", "/api/feedback", "/api/admin"],
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Feedback Platform API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

// Only listen when not in Vercel environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

export default app;
