const mongoose = require("mongoose");
// Load environment variables
require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./config/swagger.json");

// --- CORRECTED IMPORT ---
const { connectDB } = require("./database/db"); // Destructure connectDB from the exported object
// --- END CORRECTED IMPORT ---

const app = express();
app.use(express.static("public"));

const port = process.env.PORT || 3000;
const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;

const dbURI = process.env.DB_URI || "mongodb://127.0.0.1:27017/cse340"; // Use local or .env variable

// Connect to MongoDB
connectDB() // Now connectDB is correctly identified as a function
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Middleware
app.use(express.json());

// Routes
app.use("/", require("./routes/index.js"));

// Swagger UI setup
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, {
    explorer: true,
    swaggerOptions: {
      url: `${serverUrl}/api-docs/swagger.json`,
    },
  })
);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${serverUrl}`);
});
