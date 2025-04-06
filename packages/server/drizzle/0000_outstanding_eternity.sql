CREATE TYPE "public"."category" AS ENUM('ui', 'ux', 'feature', 'bug', 'enhancement');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('suggestion', 'planned', 'in_progress', 'live');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "comment" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"created_by" varchar(25) NOT NULL,
	"content" varchar(250) NOT NULL,
	"parent_id" varchar(25),
	"feedback_id" varchar(25) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback_upvotes" (
	"feedback_id" varchar(25) NOT NULL,
	"created_by" varchar(25) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"created_by" varchar(25) NOT NULL,
	"title" varchar(75) NOT NULL,
	"category" "category" NOT NULL,
	"detail" varchar(250) NOT NULL,
	"status" "status" DEFAULT 'suggestion' NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"full_name" varchar(50) NOT NULL,
	"username" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"password" text NOT NULL,
	"avatar" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"email_verification_code" varchar(64),
	"email_verification_expiry" timestamp,
	"password_reset_token" varchar(64),
	"password_reset_expiry" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_id_comment_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_feedback_id_feedback_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_upvotes" ADD CONSTRAINT "feedback_upvotes_feedback_id_feedback_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_upvotes" ADD CONSTRAINT "feedback_upvotes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;