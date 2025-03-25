import mongoose, { Schema, Types, Document } from "mongoose";
import { FeedbackCategories, FeedbackStatuses } from "../config.js";

export interface FeedbackEntity extends Document {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId;
  title: string;
  category: FeedbackCategories;
  detail: string;
  status: FeedbackStatuses;
  upvotes: string[];
}

const feedbackSchema = new Schema<FeedbackEntity>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(FeedbackCategories),
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(FeedbackStatuses),
      default: FeedbackStatuses.SUGGESTION,
    },
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export const Feedback = mongoose.model<FeedbackEntity>(
  "Feedback",
  feedbackSchema,
);
