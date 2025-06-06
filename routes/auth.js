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
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         userType:
 *           type: string
 *           enum: ["admin", "employer", "applicant", "github"]
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Creates a new user account with name, email, password, and user type.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *           example:
 *             name: "John Doe"
 *             email: "john.doe@example.com"
 *             password: "securePassword123"
 *             userType: "applicant"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully!"
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *       400:
 *         description: Invalid request or missing required fields.
 */
router.post("/register", userController.createUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     description: Authenticates a user with email and password and returns a JWT token.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *       401:
 *         description: Invalid credentials.
 */
router.post("/login", userController.loginUser);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: GitHub OAuth login initiation
 *     tags: [Authentication]
 *     description: Redirects users to GitHub's OAuth login page to initiate authentication.
 *     responses:
 *       302:
 *         description: Redirects to GitHub OAuth login.
 */
router.get("/github", userController.githubOAuthLogin);

/**
 * @swagger
 * /auth/oauth-callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     tags: [Authentication]
 *     description: Handles GitHub's OAuth callback, exchanges authorization code for an access token.
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: GitHub login successful, returns JWT token.
 *       400:
 *         description: Authorization code missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.get("/oauth-callback", userController.githubOAuthCallback);

/**
 * @swagger
 * /auth/profile/{id}:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     description: Retrieves user profile details by ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       404:
 *         description: User not found.
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
 *     description: Allows authenticated users to update their own profile or admins to update any user's profile.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.doe@example.com"
 *               userType:
 *                 type: string
 *                 enum: ["admin", "employer", "applicant", "github"]
 *                 example: "employer"
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Invalid request.
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
 *     description: Allows admins or authenticated users to delete their own account.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
router.delete(
  "/users/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.deleteUser
);

module.exports = router;
