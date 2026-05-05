import {
  Box,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useGetTeacherClasses } from "../../../api/Classes";
import CurveLoader from "../../../components/CurveLoader";
export default function MyClassesCard() {
  const { classes, loading } = useGetTeacherClasses();
  const progressValues = [72, 65, 80, 60, 90];

  if (loading) {
    return <CurveLoader />;
  }
  return (
    <Box sx={cardStyle}>
      <Typography sx={titleStyle}>My Classes</Typography>

      {classes?.slice(0, 5).map((cls, i) => (
        <Box key={cls.id}>
          <Box sx={rowStyle}>
            <Avatar sx={avatarStyle}>{cls.class_name}</Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography sx={classTitle}>{cls.book_title}</Typography>

              <Box sx={studentsRow}>
                <GroupsIcon sx={{ fontSize: 14, color: "#9aa5b1" }} />
                <Typography sx={studentsText}>
                  {Number(cls.total_students)} Students
                </Typography>
              </Box>
            </Box>

            <Box sx={progressWrapper}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={36}
                thickness={4}
                sx={{
                  color: "#e5e7eb",
                  position: "absolute",
                }}
              />

              <CircularProgress
                variant="determinate"
                 value={progressValues[i] || 0}
                size={36}
                thickness={4}
                sx={{
                  color: "#2B5A9E",
                }}
              />

              <Box sx={progressLabel}>
                <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
                  {progressValues[i] || 0}%
                </Typography>
              </Box>
            </Box>
          </Box>

          {i !== classes.length - 1 && <Divider sx={dividerStyle} />}
        </Box>
      ))}

      {/* Footer */}
      <Box sx={footerStyle}>
        <Box sx={footerStyle}>
          <Typography sx={footerText}>View all classes</Typography>

          <ArrowForwardIosIcon
            sx={{
              fontSize: 12,
              color: "#3f51b5",
              ml: 0.5,
            }}
          />
        </Box>
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
  p: 1.5,
  boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
};

const titleStyle = {
  fontWeight: 600,
  fontSize: 14,
  mb: 1.5,
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  py: 0.8,
  "&:hover": {
    background: "#f8fafc",
    borderRadius: "8px",
  },
};

const avatarStyle = {
  width: 36,
  height: 36,
  fontSize: 14,
  background: "#f1f5f9",
  color: "#64748b",
};

const classTitle = {
  fontWeight: 600,
  fontSize: 13,
};

const studentsRow = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  mt: 0.3,
};

const studentsText = {
  fontSize: 11,
  color: "#7a869a",
};

const progressWrapper = {
  position: "relative",
  display: "inline-flex",
};

const progressLabel = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const dividerStyle = {
  my: 0.5,
};
