import { Box, Typography, Grid, Paper, Avatar, Divider } from "@mui/material";
import dayjs from "dayjs";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import WelcomeBanner from "../WelcomeBanner";
import { useTeacherDashboard } from "../../../api/user_books";
import CurveLoader from "../../../components/CurveLoader";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import MyClassesCard from "./MyClassesCard";
import RecentActivityCard from "./RecentActivityCard";
import UpcomingScheduleCard from "./UpcomingScheduleCard";
import ClassProgressCard from "./ClassProgressCard";
import QuickActionsCard from "./QuickActionsCard";
import { useNavigate } from "react-router-dom";
import { useDashboardLanguage } from "../../../contexts/dashboardLanguage";
export default function Dashboard() {
  const { t } = useDashboardLanguage();
  const { stats, loading } = useTeacherDashboard();
  const navigate = useNavigate();

  dayjs.extend(utc);
  dayjs.extend(timezone);

  if (loading) {
    return <CurveLoader />;
  }
  return (
    <Box sx={{ width: "87%", mx: "auto", mb: 3 }}>
      <WelcomeBanner variant="home" />

      {/* ===== TOP SECTION ===== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          title={t("My Classes")}
          value={stats.total_classes}
          subtitle={t("Active classes")}
          growth={stats.growth.classes}
          icon={GroupsIcon}
          onClick={() => navigate("/teacher/classes")}
        />

        <StatCard
          title={t("My Students")}
          value={stats.total_students}
          subtitle={t("Total students")}
          growth={stats.growth.students}
          icon={PersonIcon}
        />

        <StatCard
          title={t("Books Assigned")}
          value={stats.total_books}
          subtitle={t("Books")}
          growth={stats.growth.books}
          onClick={() => navigate("/teacher/books")}
          icon={MenuBookIcon}
        />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 2,
        }}
      >
        <MyClassesCard />

        <RecentActivityCard />

        <UpcomingScheduleCard />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)", // 👈 نفس اللي فوق
          },
          gap: 2,
          mt: 3,
        }}
      >
        <Box sx={{ gridColumn: "span 2" }}>
          <ClassProgressCard />
        </Box>
        <QuickActionsCard />
      </Box>
    </Box>
  );
}

// eslint-disable-next-line no-unused-vars
function StatCard({ title, value, subtitle, growth, icon: Icon, onClick }) {
  const { t } = useDashboardLanguage();
  const isPositive = growth >= 0;

  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: "100%",
        textAlign: "start",
        font: "inherit",
        border: "none",
        bgcolor: "background.paper",
        borderRadius: "16px",
        p: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        },
        "&:focus-visible": {
          outline: "3px solid #2563eb",
          outlineOffset: "3px",
        },
      }}
    >
      {/* TOP ROW */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* ICON */}
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ color: "#6b7280", fontSize: 35 }} />
        </Box>

        {/* TEXT */}
        <Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 700,
              color: "text.primary",
              mt: 0.3,
            }}
          >
            {value}
          </Typography>

          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>

      {/* BOTTOM */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1.5,
        }}
      >
        {/* LEFT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: isPositive ? "#2e7d32" : "#d32f2f",
            }}
          >
            {isPositive ? "↑" : "↓"} {Math.abs(growth)}%
          </Typography>
        </Box>

        {/* RIGHT */}
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
          {t("vs last 30 days")}
        </Typography>
      </Box>
    </Box>
  );
}
