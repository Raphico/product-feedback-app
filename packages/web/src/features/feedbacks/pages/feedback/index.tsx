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
  const { goBack } = routeApi.useSearch();
  const {
    data: feedback,
    isLoading: isLoadingFeedback,
    error: feedbackError,
  } = useGetFeedbackQuery(feedbackId);
  const {
    data: commentsResult,
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

  if (!feedback && !isLoadingFeedback) {
    return (
      <NotFound
        link="/"
        linkText="View Feedbacks"
        title="Not found"
        description="The requested feedback has either been deleted or doesn't exist."
      />
    );
  }

  const hasComments = !!commentsResult && commentsResult.total > 0;

  return (
    <div className={styles["feedback"]}>
      <GoBack to={goBack} className={styles["feedback__go-back"]} />

      {user.data &&
        (user.data.id === feedback?.createdBy || user.data.role == "admin") && (
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
        {isLoadingFeedback ? <p>Loading feedback</p> : <p>Feedback Loaded</p>}
      </div>

      {isLoadingFeedback ? (
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
          comments={commentsResult.comments}
          totalComments={commentsResult.total}
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
          feedbackId={feedback.id}
          redirectContext={`/feedback/${feedback.id}`}
          className={styles["feedback__add-comment"]}
        />
      )}
    </div>
  );
}

export default FeedbackPage;
