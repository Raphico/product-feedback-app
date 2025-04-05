export type ThreadedComment = {
  id: string;
  content: string;
  createdBy: {
    id: string;
    username: string;
    fullName: string;
    avatar: string | null;
    role: "user" | "admin";
  };
  replies: ThreadedComment[];
};

export type PopulatedComment = {
  id: string;
  content: string;
  parentId: string | null;
  feedbackId: string;
  createdBy: ThreadedComment["createdBy"];
};
