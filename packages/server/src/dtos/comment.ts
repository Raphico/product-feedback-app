export type CommentResponseDto = {
  id: string;
  content: string;
  createdBy: {
    id: string;
    fullName: string;
    username: string;
    avatar: string | null;
  };
  parentId: string | null;
  feedbackId: string;
};
