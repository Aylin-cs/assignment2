import mongoose from "mongoose";
import * as postRepository from "../repositories/postRepository";
import { IPost } from "../models/postModel";

export const createPost = async (stringUserId: string, content: string): Promise<IPost> => {
  if (!stringUserId || !content) {
    throw new Error("UserId and content are required.");
  }

  const userId = new mongoose.Types.ObjectId(stringUserId);
  return await postRepository.addPost({ userId, content });
};

export const fetchAllPosts = async (userId?: string): Promise<IPost[]> => {
  const filter = userId ? { userId } : {};
  return await postRepository.getAllPosts(filter);
};

export const fetchPostById = async (id: string): Promise<IPost> => {
  const post = await postRepository.getPostById(id);
  if (!post) {
    throw new Error("Post not found.");
  }
  return post;
};

export const modifyPost = async (userId: string, postId: string, content: string): Promise<IPost> => {
  if (!content) {
    throw new Error("Content is required.");
  }

  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new Error("Post not found.");
  }

  const postUserId =
    typeof (post as any).userId === "object" && (post as any).userId !== null
      ? String((post as any).userId._id ?? (post as any).userId)
      : String((post as any).userId);

  if (postUserId !== String(userId)) {
    throw new Error("You are not authorized to modify this post.");
  }

  const updated = await postRepository.updatePost(postId, { content });
  if (!updated) {
    throw new Error("Post not found.");
  }
  return updated;
};

export const removePost = async (postId: string): Promise<boolean> => {
  return await postRepository.deletePost(postId);
};