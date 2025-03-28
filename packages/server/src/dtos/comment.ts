import type { Roles } from "../config.js";

export type CommentResponseDto = {
  id: string;
  content: string;
  createdBy: {
    id: string;
    fullName: string;
    username: string;
    avatar: string | null;
    role: Roles;
  };
  parentId: string | null;
  feedbackId: string;
};
