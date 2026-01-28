import Comment, { IComment } from "../models/commentModel";
import mongoose from "mongoose";

export const addComment = async (data: {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
}): Promise<IComment> => {
  const comment = new Comment(data);
  return await comment.save();
};
