require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Job Listing API",
    description: "API documentation for job postings and applications",
  },
  host: process.env.SERVER_URL?.replace(/^https?:\/\//, ""),
  schemes: [process.env.PROTOCOL || "http"],
  // tags: [
  //   {
  //     name: "Applicants",
  //     description: "Endpoints related to Applicants",
  //   },
  //   {
  //     name: "Applications",
  //     description: "Endpoints related to Applications",
  //   },
  //   {
  //     name: "General",
  //     description: "Endpoints related to General functionality",
  //   },
  //   {
  //     name: "Authentication",
  //     description: "Endpoints related to user authentication",
  //   },
  //   {
  //     name: "Employers",
  //     description: "Endpoints related to Employers",
  //   },
  //   {
  //     name: "Jobs",
  //     description: "Endpoints related to Jobs",
  //   },
  // ],
  securityDefinitions: {
    githubOAuth: {
      type: "oauth2",
      authorizationUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      flow: "accessCode",
      scopes: {
        user: "Access user information",
      },
    },
  },
};

const outputFile = "./config/swagger.json";
const endpointsFiles = ["../routes/index.js"]; // This allows Swagger to auto-detect all routes

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("✅ Swagger documentation generated successfully!");
  process.exit(0);
});
