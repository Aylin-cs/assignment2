import { Router } from "express";
import * as postController from "../controllers/postController";
import authService from "../services/authService";

const router = Router();
/**
 * @openapi
 * /posts:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new post
 *     description: Adds a new post.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Post
 *               content:
 *                 type: string
 *                 example: This is the content of the post.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Tech", "NodeJS"]
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request - validation error
 */
router.post("/", authService.authMiddleware, postController.addPost);

/**
 * @openapi
 * /posts:
 *   get:
 *     summary: Retrieve all posts
 *     description: Fetches a list of all posts.
 *     responses:
 *       200:
 *         description: List of posts retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", postController.getAllPosts);

/**
 * @openapi
 * /posts/{post_id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieves a specific post using its ID.
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *       404:
 *         description: Post not found
 */
router.get("/:post_id", postController.getPostById);

/**
 * @openapi
 * /posts/{post_id}:
 *   put:
 *     security:     
 *      - bearerAuth: []
 *     summary: Update a post
 *     description: Modifies an existing post by its ID.
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Post Title
 *               content:
 *                 type: string
 *                 example: Updated content for this post.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Updated", "NodeJS"]
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 */
router.put("/:post_id", authService.authMiddleware, postController.updatePost);

/**
 * @openapi
 * /posts/{post_id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a post
 *     description: Removes a post by its ID.
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete("/:post_id", authService.authMiddleware, postController.deletePost);

export default router;