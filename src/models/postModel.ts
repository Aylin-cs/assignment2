import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  comments?: mongoose.Types.ObjectId[];
}

const postSchema: Schema<IPost> = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);
export default Post;