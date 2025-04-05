import { eq } from "drizzle-orm";
import { DB } from "../../db/index.js";
import {
  comments,
  users,
  type Comment,
  type NewComment,
} from "../../db/schema.js";
import type { PopulatedComment, ThreadedComment } from "./types.js";

export function createCommentRepository(db: DB) {
  return {
    async create(comment: NewComment): Promise<Comment | undefined> {
      const [createdComment] = await db
        .insert(comments)
        .values(comment)
        .returning();
      return createdComment;
    },

    async findById(id: string): Promise<PopulatedComment | undefined> {
      const [comment] = await db
        .select({
          id: comments.id,
          content: comments.content,
          parentId: comments.parentId,
          feedbackId: comments.feedbackId,
          createdBy: {
            id: users.id,
            username: users.username,
            fullName: users.fullName,
            avatar: users.avatar,
            role: users.role,
          },
        })
        .from(comments)
        .leftJoin(users, eq(users.id, comments.createdBy))
        .where(eq(comments.id, id));

      return comment as PopulatedComment;
    },

    async findNestedByFeedbackId(
      feedbackId: string,
    ): Promise<ThreadedComment[]> {
      const flatComments = await db
        .select({
          id: comments.id,
          content: comments.content,
          parentId: comments.parentId,
          createdBy: {
            id: users.id,
            username: users.username,
            fullName: users.fullName,
            avatar: users.avatar,
            role: users.role,
          },
        })
        .from(comments)
        .where(eq(comments.feedbackId, feedbackId))
        .leftJoin(users, eq(users.id, comments.createdBy));

      const nestedComments = new Map<string, ThreadedComment>();
      const rootComments: ThreadedComment[] = [];

      flatComments.forEach((comment) =>
        nestedComments.set(comment.id, {
          id: comment.id,
          content: comment.content,
          createdBy: comment.createdBy!,
          replies: [],
        }),
      );

      flatComments.forEach(({ id, parentId }) => {
        const comment = nestedComments.get(id);
        if (!parentId) {
          rootComments.push(comment!);
        } else {
          const parent = nestedComments.get(parentId);
          parent?.replies.push(comment!);
        }
      });

      return rootComments;
    },
  };
}

export type CommentRepository = ReturnType<typeof createCommentRepository>;
