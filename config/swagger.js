require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Job Listing API",
    description: "API documentation for job postings and applications",
  },
  host: process.env.BASE_URL.replace(/^https?:\/\//, "") || "localhost:3000",
  schemes: [process.env.PROTOCOL || "http"],
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
  paths: {
    "/auth/github": {
      get: {
        summary: "Initiates GitHub OAuth login",
        responses: {
          302: {
            description: "Redirects to GitHub OAuth login",
          },
        },
      },
    },
    "/oauth-callback": {
      get: {
        summary: "Handles GitHub OAuth callback and issues JWT token",
        security: [{ githubOAuth: [] }],
        responses: {
          200: {
            description: "Returns JWT token after successful authentication",
          },
        },
      },
    },
  },
};

// ✅ Only include `index.js`, since it already imports all other routes
const outputFile = "./config/swagger.json"; // Location of generated Swagger JSON
const endpointsFiles = ["./routes/index.js"]; // This ensures ALL routes are included via index.js

// 🚀 Generate Swagger Documentation
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("✅ Swagger documentation generated successfully!");
  process.exit(0);
});
