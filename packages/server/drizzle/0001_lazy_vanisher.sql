ALTER TABLE "comment" RENAME TO "comments";--> statement-breakpoint
ALTER TABLE "feedback" RENAME TO "feedbacks";--> statement-breakpoint
ALTER TABLE "feedback_upvotes" RENAME COLUMN "created_by" TO "user_id";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comment_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comment_parent_id_comment_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comment_feedback_id_feedback_id_fk";
--> statement-breakpoint
ALTER TABLE "feedback_upvotes" DROP CONSTRAINT "feedback_upvotes_feedback_id_feedback_id_fk";
--> statement-breakpoint
ALTER TABLE "feedback_upvotes" DROP CONSTRAINT "feedback_upvotes_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedback_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_feedback_id_feedbacks_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedbacks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_upvotes" ADD CONSTRAINT "feedback_upvotes_feedback_id_feedbacks_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedbacks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_upvotes" ADD CONSTRAINT "feedback_upvotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_upvotes" ADD CONSTRAINT "feedback_upvotes_feedback_id_user_id_unique" UNIQUE("feedback_id","user_id");