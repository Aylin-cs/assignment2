import { Router } from "express";
import { createUser, getUsers, getUserById } from "../services/usersService";

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user and returns basic user info (without passwordHash).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "8b1c2f4a-3e1f-4c6b-9d2a-123456789abc"
 *                 username:
 *                   type: string
 *                   example: "johndoe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *       400:
 *         description: Missing fields
 */

const router = Router();

router.post("/", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const user = createUser(username, email, password);
  res.status(201).json({ id: user.id, username, email });
});

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users (without passwordHash).
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "8b1c2f4a-3e1f-4c6b-9d2a-123456789abc"
 *                   username:
 *                     type: string
 *                     example: "johndoe"
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-22T10:00:00.000Z"
 */

router.get("/", (_req, res) => {
  res.json(getUsers());
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Returns a single user by ID (without passwordHash).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "8b1c2f4a-3e1f-4c6b-9d2a-123456789abc"
 *                 username:
 *                   type: string
 *                   example: "johndoe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-01-22T10:00:00.000Z"
 *       404:
 *         description: User not found
 */

router.get("/:id", (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export default router;