import { Box, Typography } from "@mui/material";
import CodeIcon from "../../../assets/icon/Group (2).svg";
import MenuBookIcon from "../../../assets/icon/bookIcone.svg";
import PersonIcon from "../../../assets/icon/userIcone.svg";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import FolderIcon from "@mui/icons-material/Folder";
import { useGetActivities } from "../../../api/activities";

export default function RecentActivity() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(relativeTime);
  const { activities, loading } = useGetActivities();
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
      case "create":
        return "#E8F5E9";

      case "update":
        return "#FFF3E0";

      case "delete":
        return "#FFEBEE";

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
        {activities?.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              color: "#9aa5b1",
              textAlign: "center",
            }}
          >
            <FolderIcon sx={{ fontSize: 42, mb: 1, opacity: 0.5 }} />

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              No Activity Yet
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                mt: 0.5,
              }}
            >
              Your recent activity will appear here
            </Typography>
          </Box>
        ) : (
          activities?.slice(0, 5).map((act, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {/* ICON */}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: getColor(act.action),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src={getIcon(act.type)} width={16} />
                </Box>

                {/* TEXT */}
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                    {act.title}
                  </Typography>

                  <Typography sx={{ fontSize: 11, color: "#777" }}>
                    {act.description}
                  </Typography>
                </Box>
              </Box>

              {/* TIME */}
              <Typography sx={{ fontSize: 11, color: "#999" }}>
                {dayjs.utc(act.created_at).tz("Asia/Amman").fromNow()}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
