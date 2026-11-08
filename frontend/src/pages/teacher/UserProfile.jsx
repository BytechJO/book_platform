import DashboardSettingsPage from "../../components/settings/DashboardSettingsPage";
import { useTeacherTheme } from "../../contexts/teacherTheme";

export default function UserProfile() {
  const { mode, changeMode } = useTeacherTheme();

  return <DashboardSettingsPage role="teacher" mode={mode} changeMode={changeMode} />;
}
