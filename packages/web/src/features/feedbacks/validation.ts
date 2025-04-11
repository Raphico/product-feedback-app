import { FeedbackCategories } from "@/config";
import { z } from "zod";

export const feedbackSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(75, "Title must be at most 75 characters long"),
  category: z.nativeEnum(FeedbackCategories),
  detail: z
    .string()
    .min(10, "Detail must be at least 10 characters long")
    .max(250, "Detail must be at most 250 characters long"),
});

export type FeedbackSchema = z.infer<typeof feedbackSchema>;
