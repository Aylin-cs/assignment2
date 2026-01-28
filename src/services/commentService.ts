import * as commentRepository from "../repositories/commentRepository";

export const getCommentsForPost = async (postId: string) => {
  if (!postId) {
    throw new Error("postId is required");
  }

  return await commentRepository.getCommentsByPostId(postId);
};
