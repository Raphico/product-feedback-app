import styles from "./go-back.module.css";
import IconArrowLeft from "@/assets/icon-arrow-left.svg?react";
import { Link } from "@tanstack/react-router";

function GoBack() {
  return (
    <Link to=".." className={styles["go-back"]}>
      <IconArrowLeft />
      Go Back
    </Link>
  );
}

export default GoBack;
