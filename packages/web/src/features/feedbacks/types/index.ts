import type { Comment } from "@/features/comments/types";
import type { User } from "@/features/users/types";

export type Feedback = {
  id: string;
  title: string;
  category: Category;
  upvotes: number;
  status: Status;
  description: string;
  comments: Comment["id"];
  createdBy: User["id"];
};

export type Status = "planned" | "in progress" | "live" | "suggestion";

export type Category = "feature" | "ui" | "ux" | "enhancement" | "bug";
