import Post, { IPost } from "../models/postModel";
import { Types } from "mongoose";

interface PostData {
  userId: Types.ObjectId;
  content: string;
  comments?: Types.ObjectId[];
}

export const addPost = async (postData: PostData): Promise<IPost> => {
  const post = new Post(postData);
  return await post.save();
};

export const getAllPosts = async (
  filter: Record<string, unknown> = {}
): Promise<IPost[]> => {
  return await Post.find(filter).exec();
};

export const getPostById = async (id: string): Promise<IPost | null> => {
  return await Post.findById(id).exec();
};

export const updatePost = async (
  id: string,
  data: Partial<IPost>
): Promise<IPost | null> => {
  return await Post.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();
};

export const deletePost = async (postId: string): Promise<boolean> => {
  const result = await Post.findByIdAndDelete(postId).exec();
  return result !== null;
};

export const addCommentToPost = async (postId: string,commentId: Types.ObjectId): Promise<IPost | null> => {
  return await Post.findByIdAndUpdate(
    postId,{ $push: { comments: commentId } },{ new: true, runValidators: true }).exec();
};