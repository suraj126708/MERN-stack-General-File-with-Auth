const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const AuthRouter = require("./routes/AuthRouter");

const app = express();
require("dotenv").config();
const connectDB = require("./models/db");

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
const allowedOrigins = [
  "https://odoo-hackathon-fawn.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
];

if (process.env.NODE_ENV === "development") {
  allowedOrigins.push("http://localhost:4173");
}

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
}

console.log("Allowed CORS origins:", allowedOrigins);
console.log("Current NODE_ENV:", process.env.NODE_ENV);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

app.options("*", cors());

// API Routes
app.use("/api/auth", AuthRouter);

// Health check endpoint
app.get("/ping", (req, res) => {
  res.json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
    status: "healthy",
    cors: "enabled",
    origins: allowedOrigins,
  });
});

// Test CORS endpoint
app.get("/test-cors", (req, res) => {
  res.json({
    message: "CORS test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

// API Documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Odoo Hackathon API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/signup": "Register a new user",
        "POST /api/auth/login": "Login user",
        "GET /api/auth/profile": "Get user profile (protected)",
        "PUT /api/auth/profile": "Update user profile (protected)",
        "POST /api/auth/logout": "Logout user (protected)",
        "GET /api/auth/verify": "Verify JWT token (protected)",
      },
      health: {
        "GET /ping": "Health check",
      },
    },
    documentation: "API documentation will be available here",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    success: false,
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token expired",
      success: false,
    });
  }

  res.status(500).json({
    message: "Internal server error",
    success: false,
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
