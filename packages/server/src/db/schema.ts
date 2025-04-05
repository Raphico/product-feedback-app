import {
  pgTable,
  text,
  boolean,
  timestamp,
  varchar,
  pgEnum,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { generateId } from "./utils.js";
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES, ROLES } from "../config.js";

export const roleEnum = pgEnum("role", ROLES);
export const feedbackCategoryEnum = pgEnum("category", FEEDBACK_CATEGORIES);
export const feedbackStatusEnum = pgEnum("status", FEEDBACK_STATUSES);

export const users = pgTable("users", {
  id: varchar("id", { length: 25 }).$default(generateId).primaryKey(),
  fullName: varchar("full_name", { length: 50 }).notNull(),
  username: varchar("username", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  password: text("password").notNull(),
  avatar: text("avatar"),
  role: roleEnum("role").notNull().default("user"),
  emailVerificationCode: varchar("email_verification_code", { length: 64 }),
  emailVerificationExpiry: timestamp("email_verification_expiry"),
  passwordResetToken: varchar("password_reset_token", { length: 64 }),
  passwordResetExpiry: timestamp("password_reset_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const feedbacks = pgTable("feedback", {
  id: varchar("id", { length: 25 }).$default(generateId).primaryKey(),
  createdBy: varchar("created_by", { length: 25 })
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 75 }).notNull(),
  category: feedbackCategoryEnum("category").notNull(),
  detail: varchar("detail", { length: 250 }).notNull(),
  status: feedbackStatusEnum("status").notNull().default("suggestion"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Feedback = typeof feedbacks.$inferSelect;
export type NewFeedback = typeof feedbacks.$inferInsert;

export const comments = pgTable("comment", {
  id: varchar("id", { length: 25 }).$default(generateId).primaryKey(),
  createdBy: varchar("created_by", { length: 25 })
    .notNull()
    .references(() => users.id),
  content: varchar("content", { length: 250 }).notNull(),
  parentId: varchar("parent_id", { length: 25 }).references(
    (): AnyPgColumn => comments.id,
  ),
  feedbackId: varchar("feedback_id", { length: 25 })
    .notNull()
    .references(() => feedbacks.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export const feedbackUpvotes = pgTable("feedback_upvotes", {
  feedbackId: varchar("feedback_id", { length: 25 })
    .notNull()
    .references(() => feedbacks.id),
  userId: varchar("created_by", { length: 25 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type FeedbackUpvote = typeof feedbackUpvotes.$inferSelect;
export type NewFeedbackUpvote = typeof feedbackUpvotes.$inferInsert;
