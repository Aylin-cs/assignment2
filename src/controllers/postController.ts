import { Request, Response } from "express";
import * as postService from "../services/postService";
import * as commentService from "../services/commentService";

export const addPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const userId = (req as any).userId as string | undefined;

    if (!userId || !content) {
      res.status(400).json({ error: "UserId and content are required." });
      return;
    }

    const newPost = await postService.createPost(String(userId), content);
    res.status(201).json(newPost);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawUserId = req.params.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
    const posts = await postService.fetchAllPosts(userId);
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.post_id as string;
    const post = await postService.fetchPostById(postId);
    res.json(post);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("REQ.USER =", (req as any).user);
    const { content } = req.body;
    const user = (req as any).user;
    const userId = user?.userId || user?.id || user?._id;


    const postId = req.params.post_id as string;
    const updatedPost = await postService.modifyPost(userId, postId, content);
    res.json(updatedPost);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.post_id as string;;
    const result = await postService.removePost(postId);

    if (result) {
      res.status(200).json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addCommentToPost = async (req: Request, res: Response) => {
  try {
    const rawPostId = req.params.post_id;
    const postId = Array.isArray(rawPostId) ? rawPostId[0] : rawPostId;
    const { content } = req.body;
    const userId = (req as any).userId;

    const comment = await postService.addCommentToPost(postId, userId, content);
    return res.status(201).json(comment);
  } catch (err: any) {
    const msg = err?.message ?? "Error";
    if (msg.includes("required")) return res.status(400).json({ message: msg });
    if (msg.includes("not found")) return res.status(404).json({ message: msg });
    return res.status(500).json({ message: msg });
  }
};

export const getCommentsForPost = async (req: Request, res: Response) => {
  try {
    const rawPostId = req.params.post_id;
    const postId = Array.isArray(rawPostId) ? rawPostId[0] : rawPostId;

    const comments = await commentService.getCommentsForPost(postId);
    res.json(comments);
  } catch (err: any) {
    res.status(400).json({ message: err.message ?? "Bad request" });
  }
};
