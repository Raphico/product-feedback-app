import mongoose, { Document, Types, Schema } from "mongoose";
import { UserEntity } from "./user.js";

export interface CommentEntity extends Document {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId | UserEntity;
  content: string;
  parentId: Types.ObjectId;
  feedbackId: Types.ObjectId;
}

const commentSchema = new mongoose.Schema<CommentEntity>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    feedbackId: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
    },
  },
  { timestamps: true },
);

export const Comment = mongoose.model<CommentEntity>("Comment", commentSchema);
