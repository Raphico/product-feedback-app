import { useEffect, useState } from "react";
import SuggestionsFilter from "./suggestions-filter";
import RoadmapCard from "./roadmap-card";
import styles from "./suggestions-menu.module.css";
import { cn } from "@/lib/utils";

function SuggestionsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className={styles["menu-button"]}
        aria-expanded={isOpen}
        aria-controls="menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={toggleMenu}
      ></button>

      <div
        id="menu"
        role="menu"
        aria-hidden={!isOpen}
        className={cn(styles["menu"], {
          [styles["open"]]: isOpen,
        })}
      >
        <div className={styles["menu-content"]}>
          <SuggestionsFilter />
          <RoadmapCard />
        </div>
      </div>
    </>
  );
}

export default SuggestionsMenu;
