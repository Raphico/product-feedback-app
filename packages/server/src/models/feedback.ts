import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    upvotes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
