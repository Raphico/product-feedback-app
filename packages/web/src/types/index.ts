export type Feedback = {
  id: string;
  title: string;
  category: Category;
  upvotes: number;
  status: Status;
  description: string;
  comments: Comment["id"][];
  createdBy: User["id"];
};

export type User = {
  id: string;
  fullName: string;
  image: string;
  username: string;
};

export type Comment = {
  id: string;
  content: string;
  parentComment?: string;
  createdBy: User["id"];
};

export type Status = "planned" | "in progress" | "live" | "suggestion";

export type Category = "feature" | "ui" | "ux" | "enhancement" | "bug";
