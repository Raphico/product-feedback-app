import styles from "./feedback-board-card.module.css";

function FeedbackBoardCard() {
  return (
    <div className={styles["card"]}>
      <h1 className="h2">
        Frontend Mentor <span className="body-2">Feedback Board</span>
      </h1>
    </div>
  );
}

export default FeedbackBoardCard;
