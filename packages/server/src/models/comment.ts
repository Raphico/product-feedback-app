import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
    feedback: {
      type: mongoose.Types.ObjectId,
      ref: "Feedback",
    },
  },
  { timestamps: true },
);

export const Comment = mongoose.model("Comment", commentSchema);
