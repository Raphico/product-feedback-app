import { Link, useLocation } from "@tanstack/react-router";
import { useUser } from "../hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import styles from "./user-dock.module.css";

function UserDock() {
  const { data: user } = useUser();
  const location = useLocation();

  if (!user || location.href.includes("account")) return null;

  const initials = user.fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <Link to="/account" className={styles["dock"]}>
      <Avatar>
        <AvatarImage src={user.avatar} alt={`${user.fullName} profile image`} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </Link>
  );
}

export default UserDock;
