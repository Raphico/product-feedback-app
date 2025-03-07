import type { User } from "@/features/user/types";

export type Comment = {
  id: string;
  content: string;
  parentComment?: string;
  createdBy: User["id"];
};
