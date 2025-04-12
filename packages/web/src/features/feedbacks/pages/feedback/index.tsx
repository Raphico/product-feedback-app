import GoBack from "@/components/go-back";
import styles from "./index.module.css";
import { getRouteApi, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/button";
import FeedbackItem from "../../components/feedback-item";
import { cn } from "@/lib/utils";
import { useGetFeedbackQuery } from "../../service";
import { useGetCommentsQuery } from "@/features/comments/service";
import Skeleton from "@/components/skeleton";
import { useUser } from "@/features/user/hooks";
import CommentList from "@/features/comments/components/comment-list";
import AddComment from "@/features/comments/components/add-comment";
import EmptyCard from "@/components/empty-card";
import { useEffect } from "react";
import NotFound from "@/components/not-found";
import { showErrorToast } from "@/utils/error";

const routeApi = getRouteApi("/feedback/$feedbackId");

function FeedbackPage() {
  const { feedbackId } = routeApi.useParams();
  const {
    data: feedback,
    isLoading: isFeedbackLoading,
    error: feedbackError,
  } = useGetFeedbackQuery(feedbackId);
  const {
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useGetCommentsQuery(feedbackId);
  const user = useUser();

  useEffect(() => {
    if (commentsError) {
      showErrorToast(commentsError);
    }

    if (feedbackError) {
      showErrorToast(feedbackError);
    }
  }, [commentsError, feedbackError]);

  if (!feedback && !isFeedbackLoading) {
    return (
      <NotFound
        link="/"
        linkText="View Feedbacks"
        title="Not found"
        description="The requested feedback has either been deleted or doesn't exist."
      />
    );
  }

  const hasComments = !!comments && comments.length > 0;

  return (
    <div className={styles["feedback"]}>
      <GoBack className={styles["feedback__go-back"]} />

      {user.data && user.data.id === feedback?.createdBy && (
        <Link
          to="/feedback/$feedbackId/edit"
          params={{ feedbackId }}
          className={cn(
            buttonVariants["tertiary"],
            styles["feedback__edit-link"],
          )}
        >
          Edit feedback
        </Link>
      )}

      <div aria-live="polite" className="sr-only">
        {isFeedbackLoading ? <p>Loading feedback</p> : <p>Feedback Loaded</p>}
      </div>

      {isFeedbackLoading ? (
        <Skeleton className={styles["feedback__skeleton"]} />
      ) : feedback ? (
        <FeedbackItem
          headingTag="h1"
          isFeedbackPage
          upvoteRedirectContext={`/feedback/${feedback.id}`}
          className={styles["feedback__item"]}
          feedback={feedback}
        />
      ) : null}

      <div aria-live="polite" className="sr-only">
        {isCommentsLoading ? <p>Loading comments</p> : <p>Comments Loaded</p>}
      </div>

      {isCommentsLoading ? (
        <Skeleton className={styles["comments__skeleton"]} />
      ) : hasComments ? (
        <CommentList
          comments={comments}
          className={styles["feedback__comments"]}
        />
      ) : (
        <EmptyCard
          className={styles["feedback__empty-comments"]}
          title="There are no comments yet"
          description="Be the first to share your thoughts! Start the conversation by adding a comment below"
        />
      )}

      {feedback && (
        <AddComment
          redirectContext={`/feedback/${feedback.id}`}
          className={styles["feedback__add-comment"]}
        />
      )}
    </div>
  );
}

export default FeedbackPage;
