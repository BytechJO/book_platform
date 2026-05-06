import { Box, Typography, Grid, Paper, Avatar, Divider } from "@mui/material";
import dayjs from "dayjs";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import { useStudentDashboard } from "../../../api/user_books";
import CurveLoader from "../../../components/CurveLoader";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import MyClassesCard from "./MyClassesCard";
import RecentActivityCard from "./RecentActivityCard";
import UpcomingScheduleCard from "./UpcomingScheduleCard";
import ClassProgressCard from "./ClassProgressCard";
import QuickActionsCard from "./QuickActionsCard";
import WelcomeBanner from "../WelcomeBanner";
import { useGetStudentClasses } from "../../../api/Classes";
export default function Dashboard() {
  const { stats, loading } = useStudentDashboard();
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const {
    classes,
    loading: classesLoading,
    refetch: refetchClasses,
  } = useGetStudentClasses();
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
            md: "repeat(2, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          title="My Classes"
          value={stats.total_classes}
          subtitle="Active classes"
          growth={stats.growth.classes}
          icon={GroupsIcon}
        />

        <StatCard
          title="Books Assigned"
          value={stats.total_books}
          subtitle="Books"
          growth={stats.growth.books}
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
        <MyClassesCard classes={classes} loading={classesLoading} />

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
        <QuickActionsCard refetchClasses={refetchClasses} />
      </Box>
    </Box>
  );
}

// eslint-disable-next-line no-unused-vars
function StatCard({ title, value, subtitle, growth, icon: Icon }) {
  const isPositive = growth >= 0;

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "16px",
        p: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
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
            backgroundColor: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ color: "#6b7280", fontSize: 35 }} />
        </Box>

        {/* TEXT */}
        <Box>
          <Typography sx={{ fontSize: 13, color: "#7a869a" }}>
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 700,
              color: "#111",
              mt: 0.3,
            }}
          >
            {value}
          </Typography>

          <Typography sx={{ fontSize: 12, color: "#9aa5b1" }}>
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
        <Typography sx={{ fontSize: 11, color: "#9aa5b1" }}>
          vs last 30 days
        </Typography>
      </Box>
    </Box>
  );
}
