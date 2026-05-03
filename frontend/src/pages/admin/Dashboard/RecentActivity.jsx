import { Box, Typography } from "@mui/material";
import { useActivities } from "../../../api";
import CodeIcon from "../../../assets/icon/Group (2).svg";
import MenuBookIcon from "../../../assets/icon/bookIcone.svg";
import PersonIcon from "../../../assets/icon/userIcone.svg";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
export default function RecentActivity() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(relativeTime);
  const { activities, loading } = useActivities();
  const getIcon = (type) => {
    switch (type) {
      case "code":
        return CodeIcon;
      case "book":
        return MenuBookIcon;
      case "user":
        return PersonIcon;
      default:
        return PersonIcon;
    }
  };
  const getColor = (action) => {
    switch (action) {
      case "created":
        return "#E8F5E9"; // أخضر فاتح
      case "updated":
        return "#FFF3E0"; // برتقالي
      case "deleted":
        return "#FFEBEE"; // أحمر
      default:
        return "#E3F2FD";
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "12px",
        p: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        height: 300,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Typography sx={{ fontWeight: 600, color: "#1F4E8C", mb: 2 }}>
        Recent Activity
      </Typography>

      {/* List */}
      <Box sx={{ flex: 1 }}>
        {activities.map((item, index) => (
          <Box
            key={index}
            sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {/* ICON */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: getColor(item.action),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src={getIcon(item.type)} width={16} />
              </Box>

              {/* TEXT */}
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#777" }}>
                  {item.description}
                </Typography>
              </Box>
            </Box>

            {/* TIME */}
            <Typography sx={{ fontSize: 11, color: "#999" }}>
              {dayjs.utc(item.created_at).tz("Asia/Amman").fromNow()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
