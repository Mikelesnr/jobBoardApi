require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")();

/* ===========================
 * 📌 SWAGGER CONFIGURATION
 * =========================== */
const doc = {
  info: {
    title: "Job Listing API",
    description: "API documentation for job postings and applications",
  },
  host: process.env.BASE_URL.replace(/^https?:\/\//, "") || "localhost:3000", // Dynamically set host from .env
  schemes: [process.env.PROTOCOL || "http"], // Use protocol from .env or default to HTTP
};

/* ===========================
 * 📌 SWAGGER OUTPUT & ROUTE FILES
 * =========================== */
const outputFile = "./swagger.json"; // File where Swagger JSON will be generated
const endpointsFiles = ["../routes/index.js"];

/* ===========================
 * 🚀 GENERATE SWAGGER DOCUMENTATION
 * =========================== */
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("✅ Swagger documentation generated successfully!");
  process.exit(); // Ensures the script exits cleanly after completion
});
