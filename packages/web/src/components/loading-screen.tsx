import styles from "./loading-screen.module.css";

function LoadingScreen() {
  return (
    <div className={styles["loader-container"]}>
      <span className={styles["loader"]}></span>
    </div>
  );
}

export default LoadingScreen;
