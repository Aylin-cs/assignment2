import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request - validation error
 */
router.post("/register", authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Logs in a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized - invalid credentials
 */
router.post("/login", authController.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Generates a new access token using a refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your-refresh-token-here
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       403:
 *         description: Forbidden - invalid refresh token
 */
router.post("/refresh", authController.refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the user and invalidates the refresh token.
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized - invalid token
 */
router.post("/logout", authController.logout);

export default router;