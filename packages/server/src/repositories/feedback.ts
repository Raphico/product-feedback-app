import { type FeedbackCategories, FeedbackSortOptions } from "../config.js";
import type { FeedbackEntity } from "../models/feedback.js";
import {
  type FeedbackWithCommentCount,
  type FeedbackRepository,
  type FeedbackStats,
} from "./feedback.interface.js";
import type { UpdateQuery, FilterQuery, PipelineStage } from "mongoose";
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
    const feedback = await Feedback.findOne({ _id: id, deletedAt: null });
    if (!feedback) return null;
    return feedback;
  },

  async getFeedbackCommentCount(feedbackId: string): Promise<number> {
    const commentCount = await Comment.countDocuments({
      feedbackId: feedbackId,
    });
    return commentCount;
  },

  async getFeedbackStats(): Promise<FeedbackStats[]> {
    return Feedback.aggregate<FeedbackStats>([
      {
        $match: { deletedAt: null, status: { $ne: "suggestion" } },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
  },

  async findMany(
    sortOption: FeedbackSortOptions,
    filter?: FilterQuery<FeedbackEntity>,
  ): Promise<FeedbackWithCommentCount[]> {
    const pipeline: PipelineStage[] = [];

    const sortBy: Record<FeedbackSortOptions, Record<string, -1 | 1>> = {
      [FeedbackSortOptions.MOST_UPVOTES]: { upvoteCount: -1 },
      [FeedbackSortOptions.LEAST_UPVOTES]: { upvoteCount: 1 },
      [FeedbackSortOptions.MOST_COMMENTS]: { commentCount: -1 },
      [FeedbackSortOptions.LEAST_COMMENTS]: { commentCount: 1 },
    };

    const matchFilter = { ...filter, deletedAt: null };

    pipeline.push({ $match: matchFilter });

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
          upvoteCount: { $size: "$upvotes" },
        },
      },
      {
        $sort: sortBy[sortOption],
      },
      {
        $project: {
          comments: 0,
        },
      },
    );

    return Feedback.aggregate<FeedbackWithCommentCount>(pipeline).exec();
  },

  async updateUpvote(
    id: string,
    alreadyVoted: boolean,
    userId: string,
  ): Promise<FeedbackEntity | null> {
    return Feedback.findOneAndUpdate(
      { _id: id, deletedAt: null },
      alreadyVoted
        ? { $pull: { upvotes: userId } }
        : { $addToSet: { upvotes: userId } },
      { new: true },
    );
  },

  async update(
    id: string,
    data: UpdateQuery<FeedbackEntity>,
  ): Promise<FeedbackEntity | null> {
    return Feedback.findOneAndUpdate({ _id: id, deletedAt: null }, data, {
      new: true,
    });
  },
};
