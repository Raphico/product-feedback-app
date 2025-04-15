import styles from "./auth-layout.module.css";

function AuthLayout({ children }: React.PropsWithChildren) {
  return <div className={styles["auth-layout"]}>{children}</div>;
}

export default AuthLayout;
