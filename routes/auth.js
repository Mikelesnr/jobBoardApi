const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport"); // Add this line to import passport
const {
  authenticateUser,
  authorizeAdminOrSelf,
} = require("../middleware/authMiddleware");

<<<<<<< HEAD
// ===========================
// USER AUTHENTICATION ROUTES
// ===========================
=======
/* #swagger.tags = ['Authentication'] */
/* #swagger.description = 'User authentication, registration, and profile management' */
>>>>>>> parent of b6875c0 (swagger error fix)

/* =========================== */
/* USER AUTHENTICATION ROUTES */
/* =========================== */

/* #swagger.tags = ['Authentication']
   #swagger.description = 'Register a new user' */
router.post("/register", userController.createUser);

/* #swagger.tags = ['Authentication']
   #swagger.description = 'Log in a user' */
router.post("/login", userController.loginUser);

<<<<<<< HEAD
// ===========================
// GITHUB OAUTH ROUTES (using Passport)
// ===========================

// Initiate GitHub OAuth login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }) // Use passport.authenticate
);

// Handle GitHub OAuth callback
router.get(
  "/oauth-callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/login", // Redirect on failure
    session: false, // Set to false if you are using JWTs and not sessions
  }),
  (req, res) => {
    // This callback is executed on successful authentication
    // `req.user` will contain the user object from your GitHubStrategy's `done` callback
    try {
      const user = req.user;
      // Assuming userController has a helper to generate JWT token
      const token = userController.generateJwtToken(user);
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      res.status(200).json({
        message: "GitHub login successful!",
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Error processing GitHub OAuth callback:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

// ===========================
// USER PROFILE ROUTES
// ===========================
=======
/* =========================== */
/* GITHUB OAUTH ROUTES */
/* =========================== */

/* #swagger.tags = ['Authentication']
   #swagger.description = 'Initiate GitHub OAuth login' */
router.get("/github", userController.githubOAuthLogin);

/* #swagger.tags = ['Authentication']
   #swagger.description = 'Handle GitHub OAuth callback and issue JWT token' */
router.get("/oauth-callback", userController.githubOAuthCallback);

/* =========================== */
/* USER PROFILE ROUTES */
/* =========================== */
>>>>>>> parent of b6875c0 (swagger error fix)

/* #swagger.tags = ['Authentication']
   #swagger.description = 'Get user profile by ID (Authenticated users or admins)' */
router.get(
  "/profile/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.getUserById
);

/* #swagger.tags = ['Authentication']
   #swagger.description = 'Update user profile (Authenticated users or admins)' */
router.put(
  "/users/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.updateUser
);

/* #swagger.tags = ['Authentication']
   #swagger.description = 'Delete a user profile (Authenticated users or admins)' */
router.delete(
  "/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.deleteUser
);

module.exports = router;
