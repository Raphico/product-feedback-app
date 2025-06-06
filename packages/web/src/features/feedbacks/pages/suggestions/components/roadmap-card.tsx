import { Link } from "@tanstack/react-router";
import styles from "./roadmap-card.module.css";
import { useGetFeedbackStatsQuery } from "@/features/feedbacks/service";
import Skeleton from "@/components/skeleton";
import { useEffect } from "react";
import { showErrorToast } from "@/utils/error";

function RoadmapCard() {
  const { data: stats, isLoading, error } = useGetFeedbackStatsQuery();

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  const planned = stats?.planned ?? 0;
  const inProgress = stats?.inProgress ?? 0;
  const live = stats?.live ?? 0;

  return (
    <section className={styles["roadmap"]}>
      <h2 className="h3">Roadmap</h2>
      <Link className={`${styles["roadmap__link"]} body-3`} to="/roadmap">
        View
      </Link>

      <div aria-live="polite" className="sr-only">
        {isLoading && <p>Loading feedback stats</p>}
        {!isLoading && stats && <p>Feedback stats loaded</p>}
      </div>

      <dl className={styles["roadmap__summary"]}>
        <div>
          <dt>Planned</dt>
          <dd>
            {isLoading ? (
              <Skeleton className={styles["roadmap__stats-skeleton"]} />
            ) : (
              planned
            )}
          </dd>
        </div>
        <div>
          <dt>In Progress</dt>
          <dd>
            {isLoading ? (
              <Skeleton className={styles["roadmap__stats-skeleton"]} />
            ) : (
              inProgress
            )}
          </dd>
        </div>
        <div>
          <dt>Live</dt>
          <dd>
            {isLoading ? (
              <Skeleton className={styles["roadmap__stats-skeleton"]} />
            ) : (
              live
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default RoadmapCard;
