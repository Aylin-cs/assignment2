import { Router } from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../services/usersService";

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

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const user = await createUser(username, email, password);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
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

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     description: Updates a user's fields.
 *     parameters:
 *       - in: path
 *         name: id
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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: No fields to update
 *       404:
 *         description: User not found
 */

router.put("/:id", (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email && !password) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const updated = updateUser(req.params.id, { username, email, password });
  if (!updated) return res.status(404).json({ message: "User not found" });

  res.json(updated);
});

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Deletes a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

router.delete("/:id", (req, res) => {
  const deleted = deleteUser(req.params.id);
  if (!deleted) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted successfully" });
});

export default router;