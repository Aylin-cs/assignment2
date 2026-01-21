import { Request, Response } from "express";
import * as postService from "../services/postService";

export const addPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const { userId } = req.body;

    const newPost = await postService.createPost(userId, content);
    res.status(201).json(newPost);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string | undefined;
    const posts = await postService.fetchAllPosts(userId);
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await postService.fetchPostById(req.params.post_id);
    res.json(post);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const { userId } = req.body;

    const updatedPost = await postService.modifyPost(userId, req.params.post_id, content);
    res.json(updatedPost);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.post_id;
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