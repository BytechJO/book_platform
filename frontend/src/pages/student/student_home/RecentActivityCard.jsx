import { Box, Typography, Divider } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CurveLoader from "../../../components/CurveLoader";
import { useGetStudentActivities } from "../../../api/studentActivities";
import { useNavigate } from "react-router-dom";

export default function RecentActivityCard() {
  const navigate = useNavigate();

  const { activities, loading } = useGetStudentActivities();
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
        activities?.slice(0, 5).map((act, i) => {
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
        })
      )}

      {/* Footer */}
      <Box sx={footerStyle}>
        <Typography
          onClick={() => navigate("/student/activities")}
          sx={{
            ...footerText,
            cursor: "pointer",

            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          View all Activities
        </Typography>

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
  pt: 2,
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
  p: 1.5,
  boxShadow: "0 1px 6px rgba(0,0,0,0.05)",

  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
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
