import { Box, Typography } from "@mui/material";
import { useAuthMe } from "../../api/auth";

export default function WelcomeBanner() {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const { user } = useAuthMe();
  const firstName = user?.full_name.split(" ")[0];
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#1A4D96",
        color: "white",
        px: 6,
        height:"150px"
      }}
    >
      {/* Date */}
      <Typography
        sx={{
          opacity: 0.9,
          pt:1,
          mb: 3,
          fontFamily: "Poppins",
          fontWeight: 400,
          fontSize: "16px",
        }}
      >
        {today}
      </Typography>

      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 1,
          fontFamily: "Poppins",
        }}
      >
        Welcome back, Teacher {firstName} !
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body1"
        sx={{
          opacity: 0.9,
          fontFamily: "Poppins",
        }}
      >
        Always stay updated in your student portal
      </Typography>
    </Box>
  );
}
