require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Listing API",
      version: "1.0.0",
      description: "API documentation for job postings and applications",
    },
    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:3000",
        description: `${
          process.env.NODE_ENV === "production" ? "Production" : "Development"
        } Server`,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ["./controllers/*.js", "./routes/*.js", "./models/*.js"], // Load all route files with JSDoc annotations
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
