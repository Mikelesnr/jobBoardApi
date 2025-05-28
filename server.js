const mongoose = require("mongoose");

// Load environment variables
require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./config/swagger.json");

/* ===========================
 * DATABASE CONNECTION
 * =========================== */
const { connectDB } = require("./database/db"); // Destructure connectDB from the exported object

const app = express();
app.use(express.static("public"));

/* ===========================
 * SERVER CONFIGURATION
 * =========================== */
const port = process.env.PORT || 3000;
const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;

const dbURI = process.env.DB_URI || "mongodb://127.0.0.1:27017/cse340"; // Use local or .env variable

/* ===========================
 * CONNECT TO MONGODB
 * =========================== */
connectDB() // Now connectDB is correctly identified as a function
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

/* ===========================
 * MIDDLEWARE SETUP
 * =========================== */
app.use(express.json());

/* ===========================
 * ROUTES CONFIGURATION
 * =========================== */
app.use("/", require("./routes/index.js"));

/* ===========================
 * SWAGGER API DOCUMENTATION
 * =========================== */
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

/* ===========================
 * START SERVER
 * =========================== */
app.listen(port, () => {
  console.log(`Server is running on ${serverUrl}`);
});
