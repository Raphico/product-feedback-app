import type { UpdateQuery, FilterQuery } from "mongoose";
import {
  type FeedbackCategories,
  FeedbackSortOptions,
  FeedbackStatuses,
} from "../config.js";
import type { FeedbackEntity } from "../models/feedback.js";

export interface FeedbackWithCommentCount extends FeedbackEntity {
  commentCount: number;
}

export type FeedbackStatsStatuses = Exclude<
  FeedbackStatuses,
  FeedbackStatuses.SUGGESTION
>;

export interface FeedbackStats {
  _id: FeedbackStatsStatuses;
  count: number;
}

export interface FeedbackRepository {
  create(data: {
    createdBy: string;
    title: string;
    category: FeedbackCategories;
    detail: string;
  }): Promise<FeedbackEntity>;
  findById(id: string): Promise<FeedbackEntity | null>;
  findMany(
    sortOption: FeedbackSortOptions,
    filter?: FilterQuery<FeedbackEntity>,
  ): Promise<FeedbackWithCommentCount[]>;
  getFeedbackStats(): Promise<FeedbackStats[]>;
  getFeedbackCommentCount(feedbackId: string): Promise<number>;
  updateUpvote(
    id: string,
    alreadyVoted: boolean,
    userId: string,
  ): Promise<FeedbackEntity | null>;
  update(
    id: string,
    data: UpdateQuery<FeedbackEntity>,
  ): Promise<FeedbackEntity | null>;
}
