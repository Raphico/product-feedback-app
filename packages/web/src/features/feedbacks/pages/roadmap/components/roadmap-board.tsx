import type { Feedback } from "@/features/feedbacks/types";
import { FeedbackStatuses } from "@/config";
import {
  DndContext,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import RoadmapBoardColumn from "./roadmap-board-column";
import styles from "./roadmap-board.module.css";
import { useUpdateFeedbackMutation } from "@/features/feedbacks/service";
import { toast } from "sonner";
import { showErrorToast } from "@/utils/error";
import { MouseSensor, PointerSensor, TouchSensor } from "@/lib/utils/dnd";

interface RoadmapBoardProps {
  feedbacks: Feedback[];
}

type BoardColumns = Exclude<FeedbackStatuses, FeedbackStatuses.SUGGESTION>;

const COLUMN_INFO = {
  [FeedbackStatuses.PLANNED]: {
    title: "Planned",
    status: FeedbackStatuses.PLANNED,
    description: "Ideas prioritized for research",
  },
  [FeedbackStatuses.IN_PROGRESS]: {
    title: "In Progress",
    status: FeedbackStatuses.IN_PROGRESS,
    description: "Currently being developed",
  },
  [FeedbackStatuses.LIVE]: {
    title: "Live",
    status: FeedbackStatuses.LIVE,
    description: "Released features",
  },
};

function RoadmapBoard({ feedbacks }: RoadmapBoardProps) {
  const [updateFeedback] = useUpdateFeedbackMutation();
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor),
  );
  const groupedFeedbacks = feedbacks.reduce(
    function groupFeedbacks(accumulator, feedback) {
      accumulator[feedback.status as BoardColumns].push(feedback);
      return accumulator;
    },
    {
      [FeedbackStatuses.PLANNED]: [],
      [FeedbackStatuses.IN_PROGRESS]: [],
      [FeedbackStatuses.LIVE]: [],
    } as Record<BoardColumns, Feedback[]>,
  );

  async function handleUpdateFeedbackOnDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const newStatus = over.id as FeedbackStatuses;
    const feedbackId = active.id as string;
    const currentFeedbackStatus = active.data.current
      ?.status as FeedbackStatuses;

    if (newStatus == currentFeedbackStatus) return;

    try {
      await updateFeedback({
        id: feedbackId,
        status: newStatus,
        _optimistic: true,
      }).unwrap();
      toast.success("Feedback updated. Thanks for keeping it fresh!");
    } catch (error) {
      showErrorToast(error);
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleUpdateFeedbackOnDragEnd}>
      <section className={styles["roadmap-board"]}>
        <h2 className="sr-only">Roadmap Board</h2>
        {Object.entries(groupedFeedbacks).map(([status, feedbacks]) => {
          const column = COLUMN_INFO[status as BoardColumns];

          return (
            <RoadmapBoardColumn
              key={status}
              column={column}
              feedbacks={feedbacks}
            />
          );
        })}
      </section>
    </DndContext>
  );
}

export default RoadmapBoard;
