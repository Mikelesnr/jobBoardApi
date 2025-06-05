const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const setupSwagger = require("./config/swagger"); // Import Swagger setup
const { requestLogger, errorHandler } = require("./utilities/middleware");
const { connectDB } = require("./database/db");

const app = express();
app.use(express.static("public")); // Serve static files

// Enable CORS globally
app.use(cors());

// Apply middleware
app.use(requestLogger);
app.use(express.json());

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if DB connection fails
  }
};
startServer();

// Routes Configuration
app.use("/", require("./routes/index")); // Import routes

// Swagger API Documentation (Using swagger-jsdoc)
setupSwagger(app); // Register Swagger docs

// Global Error Handler
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
