import { Feedback } from "@/features/feedbacks/types";
import type { User } from "@/features/user/types";

export type Comment = {
  id: string;
  content: string;
  feedbackId: Feedback["id"];
  parentComment: string | null;
  createdBy: User["id"];
};

export interface CommentWithReplies extends Omit<Comment, "createdBy"> {
  createdBy: User;
  replies: CommentWithReplies[];
}
