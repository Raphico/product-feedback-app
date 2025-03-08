import { useAppSelector } from "@/lib/hooks";
import { selectFeedbackComments } from "../selectors";

export function useFeedbackComments(feedbackId: string) {
  return useAppSelector(selectFeedbackComments(feedbackId));
}
