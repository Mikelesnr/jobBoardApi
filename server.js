const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors"); // ✅ Import CORS middleware
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./config/swagger.json");
const { requestLogger, errorHandler } = require("./utilities/middleware"); // ✅ Import middleware

/* =========================== */
/* 📌 Database Connection */
/* =========================== */
const { connectDB } = require("./database/db");

const app = express();
app.use(express.static("public"));

/* =========================== */
/* 📌 Enable CORS (Allows requests from any origin) */
/* =========================== */
app.use((req, res, next) => {
  if (req.path.startsWith("/api-docs")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return next();
  }
  cors()(req, res, next); // ✅ Default CORS for all other routes
});

/* =========================== */
/* 📌 Apply Middleware */
/* =========================== */
app.use(requestLogger); // ✅ Log requests
app.use(express.json()); // ✅ Parse JSON requests

/* =========================== */
/* 📌 Connect to MongoDB */
/* =========================== */
connectDB()
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

/* =========================== */
/* 📌 Routes Configuration */
/* =========================== */
app.use("/", require("./routes/index")); // ✅ Import and use routes

/* =========================== */
/* 📌 get server from environment variables */
/* =========================== */
const port = process.env.PORT || 3000;
const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;
/* =========================== */
/* 📌 Swagger API Documentation */
/* =========================== */
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, {
    explorer: true,
    swaggerOptions: {
      url: `${serverUrl}/api-docs/swagger.json`,
      oauth2RedirectUrl: `${serverUrl}/oauth-callback`, // Ensure callback is correct
    },
    oauth: {
      clientId: process.env.CLIENT_ID,
      appName: "Job Listing API",
      scopeSeparator: ",",
      scopes: ["user"],
    },
  })
);

/* =========================== */
/* 📌 Apply Global Error Handler */
/* =========================== */
app.use(errorHandler); // ✅ Catch and handle errors

/* =========================== */
/* 📌 Start Server */
/* =========================== */

app.listen(port, () => {
  console.log(`🚀 Server is running on ${serverUrl}`);
});
