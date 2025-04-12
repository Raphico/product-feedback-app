import type { User } from "@/features/user/types";

export type Comment = {
  id: string;
  content: string;
  feedbackId: string;
  parentId: string | null;
  createdBy: Pick<User, "id" | "username" | "fullName" | "avatar">;
};

export type ThreadedComment = Comment & {
  replies: ThreadedComment[];
};

export type CommentThreadResponse = {
  comments: ThreadedComment[];
  total: number;
};
