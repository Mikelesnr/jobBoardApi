require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Job Listing API",
    description: "API documentation for job postings and applications",
  },
<<<<<<< HEAD
  host: process.env.SERVER_URL?.replace(/^https?:\/\//, ""), // Ensure host is clean
  schemes: [process.env.PROTOCOL || "http"], // Use environment variable for protocol or default to http
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
=======
  host: process.env.SERVER_URL?.replace(/^https?:\/\//, ""),
  schemes: [process.env.PROTOCOL || "http"],
  tags: [
    {
      name: "Applicants",
      description: "Endpoints related to Applicants",
    },
    {
      name: "Applications",
      description: "Endpoints related to Applications",
    },
    {
      name: "General",
      description: "Endpoints related to General functionality",
    },
    {
      name: "Authentication",
      description: "Endpoints related to user authentication",
    },
    {
      name: "Employers",
      description: "Endpoints related to Employers",
    },
    {
      name: "Jobs",
      description: "Endpoints related to Jobs",
    },
  ],
>>>>>>> parent of b6875c0 (swagger error fix)
  securityDefinitions: {
    bearerAuth: {
      // Adding a bearer token definition for JWT authentication
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter your JWT token in the format 'Bearer YOUR_TOKEN'",
    },
    githubOAuth: {
      type: "oauth2",
      authorizationUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      flow: "accessCode",
      scopes: {
        "user:email":
          "Access user's primary email address and basic profile information", // More precise scope
      },
    },
  },
};

const outputFile = "./config/swagger.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("✅ Swagger documentation generated successfully!");
});
