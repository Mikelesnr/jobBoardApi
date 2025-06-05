const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateUser,
  authorizeAdminOrSelf,
} = require("../middleware/authMiddleware");

/* #swagger.tags = ['Authentication'] */
/* #swagger.description = 'User authentication, registration, and profile management' */

/* =========================== */
/* USER AUTHENTICATION ROUTES */
/* =========================== */

/* #swagger.tags = ['Authentication']
   #swagger.description = 'Register a new user' */
router.post("/register", userController.createUser);

/* #swagger.tags = ['Authentication']
   #swagger.description = 'Log in a user' */
router.post("/login", userController.loginUser);

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
