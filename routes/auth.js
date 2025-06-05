const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport"); // Add this line to import passport
const {
  authenticateUser,
  authorizeAdminOrSelf,
} = require("../middleware/authMiddleware");

// ===========================
// USER AUTHENTICATION ROUTES
// ===========================

router.post("/register", userController.createUser);

router.post("/login", userController.loginUser);

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

router.get(
  "/profile/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.getUserById
);

router.put(
  "/users/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.updateUser
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.deleteUser
);

module.exports = router;
