const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateUser,
  authorizeAdminOrSelf,
} = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication, registration, OAuth login, and profile management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Creates a new user account
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserRegistration"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request or missing required fields
 */
router.post("/register", userController.createUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     description: Authenticates a user and returns a JWT token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserLogin"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", userController.loginUser);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: GitHub OAuth login initiation
 *     tags: [Authentication]
 *     description: Redirects users to GitHub's OAuth login page
 *     responses:
 *       302:
 *         description: Redirects to GitHub OAuth login
 */
router.get("/github", userController.githubOAuthLogin);

/**
 * @swagger
 * /auth/oauth-callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     tags: [Authentication]
 *     description: Handles OAuth callback from GitHub and returns JWT token
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from GitHub
 *     responses:
 *       200:
 *         description: GitHub login successful, returns JWT token
 *       400:
 *         description: Authorization code missing or invalid
 *       500:
 *         description: Internal server error during OAuth processing
 */
router.get("/oauth-callback", userController.githubOAuthCallback);

/**
 * @swagger
 * /auth/profile/{id}:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     description: Retrieves user profile details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       404:
 *         description: User not found
 */
router.get(
  "/profile/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.getUserById
);

/**
 * @swagger
 * /auth/users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     description: Allows authenticated users or admins to update user profile
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid request or missing required fields
 */
router.put(
  "/users/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.updateUser
);

/**
 * @swagger
 * /auth/users/{id}:
 *   delete:
 *     summary: Delete user profile
 *     tags: [Authentication]
 *     description: Allows admins or authenticated users to delete their account
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Unauthorized access
 */
router.delete(
  "/users/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.deleteUser
);

module.exports = router;
