import type { FeedbackCategories } from "../config.js";
import type { FeedbackEntity } from "../models/feedback.js";
import {
  FeedbackWithCommentCount,
  type FeedbackRepository,
} from "./feedback.interface.js";
import type { UpdateQuery } from "mongoose";
import { Feedback } from "../models/feedback.js";
import { Comment } from "../models/comment.js";

export const feedbackRepository: FeedbackRepository = {
  async create(feedback: {
    createdBy: string;
    title: string;
    category: FeedbackCategories;
    detail: string;
  }): Promise<FeedbackEntity> {
    return Feedback.create(feedback);
  },
  async findById(id: string): Promise<FeedbackEntity | null> {
    const feedback = await Feedback.findOne({ _id: id });
    if (!feedback) return null;
    return feedback;
  },
  async getFeedbackCommentCount(feedbackId: string): Promise<number> {
    const commentCount = await Comment.countDocuments({
      feedbackId: feedbackId,
    });
    return commentCount;
  },
  async findMany(
    filter?: UpdateQuery<FeedbackEntity>,
  ): Promise<FeedbackWithCommentCount[]> {
    const pipeline: any[] = [];

    if (filter && Object.keys(filter).length > 0) {
      pipeline.push({ $match: filter });
    }

    pipeline.push(
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "feedbackId",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
        },
      },
      {
        $project: {
          comments: 0,
        },
      },
    );

    const feedbacks =
      await Feedback.aggregate<FeedbackWithCommentCount>(pipeline).exec();

    return feedbacks;
  },
  async updateUpvote(
    id: string,
    alreadyVoted: boolean,
    userId: string,
  ): Promise<FeedbackEntity | null> {
    return Feedback.findOneAndUpdate(
      { _id: id },
      alreadyVoted
        ? { $pull: { upvotes: userId } }
        : { $addToSet: { upvotes: userId } },
      {
        new: true,
      },
    );
  },
  async update(
    id: string,
    data: UpdateQuery<FeedbackEntity>,
  ): Promise<FeedbackEntity | null> {
    return Feedback.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
  },
};
