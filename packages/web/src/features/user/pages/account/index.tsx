import GoBack from "@/components/go-back";
import styles from "./index.module.css";
import { useUser } from "../../hooks";
import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardSeparator,
  CardTitle,
} from "@/components/card";
import ProfileForm from "./components/profile-form";
import Logout from "./components/logout";
import AvatarUploader from "./components/avatar-uploader";

function AccountPage() {
  const { data: userData } = useUser();

  if (!userData) return null;

  return (
    <div className={styles["account"]}>
      <GoBack className="account__go-back" />
      <Card>
        <CardHeader>
          <CardTitle>Your Account</CardTitle>
          <CardDescription>
            Manage your personal information and account settings
          </CardDescription>
        </CardHeader>
        <CardBody>
          <AvatarUploader userData={userData} />
          <CardSeparator />
          <ProfileForm userData={userData} />
          <CardSeparator />
          <Logout />
        </CardBody>
      </Card>
    </div>
  );
}

export default AccountPage;
