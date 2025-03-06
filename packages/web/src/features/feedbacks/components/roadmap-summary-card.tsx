import { Link } from "@tanstack/react-router";
import styles from "./roadmap-summary-card.module.css";
import { useRoadmapSummary } from "../hooks";

function RoadmapSummaryCard() {
  const summary = useRoadmapSummary();

  return (
    <section className={styles["roadmap"]}>
      <h2 className="h3">Roadmap</h2>
      <Link className={`${styles["roadmap__link"]} body-3`} to=".">
        View
      </Link>
      <dl className={styles["roadmap__summary"]}>
        <div>
          <dt>Planned</dt>
          <dd>{summary.planned}</dd>
        </div>
        <div>
          <dt>In Progress</dt>
          <dd>{summary.inProgress}</dd>
        </div>
        <div>
          <dt>Live</dt>
          <dd>{summary.live}</dd>
        </div>
      </dl>
    </section>
  );
}

export default RoadmapSummaryCard;
