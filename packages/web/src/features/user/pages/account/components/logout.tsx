import Spinner from "@/components/spinner";
import { useLogoutMutation } from "@/features/auth/service";
import { showErrorToast } from "@/utils/error";
import { useNavigate } from "@tanstack/react-router";
import styles from "./logout.module.css";

function Logout() {
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout().unwrap();
      navigate({
        to: "/",
      });
    } catch (error) {
      showErrorToast(error);
    }
  }

  return (
    <div className={styles["logout"]}>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        aria-label="Log out"
        className={styles["logout__button"]}
      >
        {isLoggingOut && <Spinner className={styles["logout__spinner"]} />}
        Log out
      </button>
      <p>Sign out of your account on this device.</p>
    </div>
  );
}

export default Logout;
