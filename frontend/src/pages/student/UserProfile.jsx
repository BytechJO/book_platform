import DashboardSettingsPage from "../../components/settings/DashboardSettingsPage";
import { useStudentTheme } from "../../contexts/studentTheme";

export default function UserProfile() {
  const { mode, changeMode } = useStudentTheme();

  return <DashboardSettingsPage role="student" mode={mode} changeMode={changeMode} />;
}
