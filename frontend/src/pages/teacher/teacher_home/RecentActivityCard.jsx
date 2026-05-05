import { Box, Typography, Divider } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useMyActivities } from "../../../api";
import CurveLoader from "../../../components/CurveLoader";

export default function RecentActivityCard() {
  const { activities, loading } = useMyActivities();
  if (loading) {
    return <CurveLoader />;
  }
  const formatTime = (date) => {
    const now = new Date();
    const d = new Date(date);

    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();

    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today, ${time}`;
    if (isYesterday) return `Yesterday, ${time}`;

    return d.toLocaleDateString() + `, ${time}`;
  };

  return (
    <Box sx={cardStyle}>
      <Typography sx={titleStyle}>Recent Activity</Typography>

      {activities?.slice(0, 5).map((act, i) => {
        // 🎯 تحديد الأيقونة حسب النوع
        const getIcon = () => {
          if (act.type === "class" && act.action === "join")
            return <PersonIcon fontSize="small" />;
          if (act.type === "class" && act.action === "create")
            return <FolderIcon fontSize="small" />;
          if (act.type === "book") return <MenuBookIcon fontSize="small" />;

          return <FolderIcon fontSize="small" />;
        };

        // 🕒 تحويل الوقت
        const time = formatTime(act.created_at);
        return (
          <Box key={act.id}>
            <Box sx={rowStyle}>
              <Box sx={iconBox}>{getIcon()}</Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={textStyle}>{act.description}</Typography>

                <Typography sx={timeStyle}>{time}</Typography>
              </Box>
            </Box>

            {i !== activities.length - 1 && <Divider sx={dividerStyle} />}
          </Box>
        );
      })}
      <Divider sx={{ my: 1 }} />

      {/* Footer */}
      <Box sx={footerStyle}>
        <Typography sx={footerText}>View all Activities</Typography>

        <ArrowForwardIosIcon
          sx={{
            fontSize: 12,
            color: "#3f51b5",
            ml: 0.5,
          }}
        />
      </Box>
    </Box>
  );
}

/* ===== STYLES ===== */
const footerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 0.5,
  pt: 1,
};

const footerText = {
  fontSize: 12,
  color: "#3f51b5",
  fontWeight: 500,
  cursor: "pointer",
};
const cardStyle = {
  background: "#fff",
  borderRadius: "12px",
  p: 1.5, // 👈 نفس الكلاس
  boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
};

const titleStyle = {
  fontWeight: 600,
  fontSize: 14, // 👈 نفس الكلاس
  mb: 1.5,
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.5, // 👈 نفس الكلاس
  py: 0.8,
  "&:hover": {
    background: "#f8fafc",
    borderRadius: "8px",
  },
};

const iconBox = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  backgroundColor: "#f1f5f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
};

const textStyle = {
  fontSize: 13, // 👈 نفس الكلاس
  fontWeight: 500,
};

const timeStyle = {
  fontSize: 11, // 👈 نفس الكلاس
  color: "#7a869a",
  mt: 0.2,
};

const dividerStyle = {
  my: 0.5,
};
