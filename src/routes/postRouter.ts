import { Router } from "express";
import * as postController from "../controllers/post.controller";

const router = Router();

router.post("/", postController.addPost);
router.get("/", postController.getAllPosts);
router.get("/:post_id", postController.getPostById);
router.put("/:post_id", postController.updatePost);
router.delete("/:post_id", postController.deletePost);

export default router;