import type { User } from "@/features/user/types";

export type Comment = {
  id: string;
  content: string;
  createdBy: Pick<User, "id" | "username" | "fullName" | "avatar">;
  replies: Comment[];
};
