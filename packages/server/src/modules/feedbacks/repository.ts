import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import { DB } from "../../db/index.js";
import {
  comments,
  feedbacks,
  feedbackUpvotes,
  type Feedback,
  type NewFeedback,
} from "../../db/schema.js";
import { FeedbackSortOptions } from "../../config.js";
import { ExtendedFeedback } from "./validation.js";

export function createFeedbackRepository(db: DB) {
  return {
    async create(feedback: NewFeedback): Promise<Feedback | undefined> {
      const [createdFeedback] = await db
        .insert(feedbacks)
        .values(feedback)
        .returning();
      return createdFeedback;
    },

    async findById(id: string): Promise<Feedback | undefined> {
      const [feedback] = await db
        .select()
        .from(feedbacks)
        .where(and(eq(feedbacks.id, id), isNull(feedbacks.deletedAt)));

      return feedback;
    },

    async findExtendedById(
      id: string,
      currentUserId: string = "",
    ): Promise<ExtendedFeedback | undefined> {
      const [feedback] = await db
        .select({
          id: feedbacks.id,
          createdBy: feedbacks.createdBy,
          title: feedbacks.title,
          detail: feedbacks.detail,
          status: feedbacks.status,
          category: feedbacks.category,
          commentCount: sql<number>`COUNT(${comments.id})`.as("comment_count"),
          upvoteCount: sql<number>`COUNT(${feedbackUpvotes.userId})`.as(
            "upvote_count",
          ),
          hasUpvote: sql<boolean>`
            CASE WHEN MAX(CASE WHEN ${feedbackUpvotes.userId} = ${currentUserId} THEN 1 ELSE 0 END) = 1
              THEN TRUE 
              ELSE FALSE END
          `.as("has_upvote"),
        })
        .from(feedbacks)
        .leftJoin(comments, eq(comments.feedbackId, feedbacks.id))
        .leftJoin(feedbackUpvotes, eq(feedbackUpvotes.feedbackId, feedbacks.id))
        .groupBy(feedbacks.id)
        .where(and(eq(feedbacks.id, id), isNull(feedbacks.deletedAt)));

      return feedback;
    },

    async computeStats(): Promise<{
      inProgress: number;
      planned: number;
      live: number;
    }> {
      const [stats] = await db
        .select({
          inProgress: sql<number>`COALESCE(SUM(CASE WHEN ${feedbacks.status} = 'in_progress' THEN 1 END), 0)`,
          planned: sql<number>`COALESCE(SUM(CASE WHEN ${feedbacks.status} = 'planned' THEN 1 END), 0)`,
          live: sql<number>`COALESCE(SUM(CASE WHEN ${feedbacks.status} = 'live' THEN 1 END), 0)`,
        })
        .from(feedbacks)
        .where(isNull(feedbacks.deletedAt));

      return {
        inProgress: Number(stats?.inProgress ?? 0),
        planned: Number(stats?.planned ?? 0),
        live: Number(stats?.live ?? 0),
      };
    },

    async findAll({
      sort,
      currentUserId,
      filter,
    }: {
      sort: FeedbackSortOptions;
      currentUserId?: string;
      filter: Omit<Partial<Feedback>, "deletedAt">;
    }): Promise<ExtendedFeedback[]> {
      const sortBy = {
        [FeedbackSortOptions.MOST_UPVOTES]: desc(
          sql<number>`COUNT(${feedbackUpvotes.userId})`,
        ),
        [FeedbackSortOptions.LEAST_UPVOTES]: asc(
          sql<number>`COUNT(${feedbackUpvotes.userId})`,
        ),
        [FeedbackSortOptions.MOST_COMMENTS]: desc(
          sql<number>`COUNT(${comments.id})`,
        ),
        [FeedbackSortOptions.LEAST_COMMENTS]: asc(
          sql<number>`COUNT(${comments.id})`,
        ),
      };

      return db
        .select({
          id: feedbacks.id,
          createdBy: feedbacks.createdBy,
          title: feedbacks.title,
          detail: feedbacks.detail,
          status: feedbacks.status,
          category: feedbacks.category,
          commentCount: sql<number>`COUNT(${comments.id})`.as("comment_count"),
          upvoteCount: sql<number>`COUNT(${feedbackUpvotes.userId})`.as(
            "upvote_count",
          ),
          hasUpvote: sql<boolean>`
            CASE WHEN MAX(CASE WHEN ${feedbackUpvotes.userId} = ${currentUserId} THEN 1 ELSE 0 END) = 1
              THEN TRUE 
              ELSE FALSE END
          `.as("has_upvote"),
        })
        .from(feedbacks)
        .where(
          and(
            isNull(feedbacks.deletedAt),
            ...Object.entries(filter).map(([key, value]) =>
              eq(feedbacks[key as keyof Feedback], value),
            ),
          ),
        )
        .leftJoin(comments, eq(comments.feedbackId, feedbacks.id))
        .leftJoin(feedbackUpvotes, eq(feedbackUpvotes.feedbackId, feedbacks.id))
        .groupBy(feedbacks.id)
        .orderBy(sortBy[sort]);
    },

    async toggleUpvote(feedbackId: string, userId: string): Promise<void> {
      await db.transaction(async (tx) => {
        const alreadyVoted = await tx.query.feedbackUpvotes.findFirst({
          where: and(
            eq(feedbackUpvotes.userId, userId),
            eq(feedbackUpvotes.feedbackId, feedbackId),
          ),
        });

        if (alreadyVoted) {
          await tx
            .delete(feedbackUpvotes)
            .where(
              and(
                eq(feedbackUpvotes.feedbackId, feedbackId),
                eq(feedbackUpvotes.userId, userId),
              ),
            );
        } else {
          await tx.insert(feedbackUpvotes).values({
            feedbackId,
            userId,
          });
        }
      });
    },

    async update(
      id: string,
      data: Partial<NewFeedback>,
    ): Promise<Feedback | undefined> {
      const [updatedFeedback] = await db
        .update(feedbacks)
        .set(data)
        .where(and(eq(feedbacks.id, id), isNull(feedbacks.deletedAt)))
        .returning();

      return updatedFeedback;
    },
  };
}

export type FeedbackRepository = ReturnType<typeof createFeedbackRepository>;
