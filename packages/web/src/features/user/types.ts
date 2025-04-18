export enum Roles {
  ADMIN = "admin",
  USER = "user",
}

export type User = {
  id: string;
  fullName: string;
  email: string;
  username: string;
  avatar: string | null;
  role: Roles;
};
