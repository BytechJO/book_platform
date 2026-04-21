import { Box, Typography, Avatar } from "@mui/material";
import { useAuthMe } from "../../api/auth";

export default function WelcomeBanner() {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { user } = useAuthMe();

  const firstName = user?.full_name?.split(" ")[0];
  const firstLetter = user?.full_name?.charAt(0)?.toUpperCase();

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 2, sm: 4, md: 8, lg: 14 }, // 👈 ريسبونسف
        py: { xs: 2, md: 3 },
        display: "flex",
        alignItems: "center",
        gap: 3,
      }}
    >
      {/* Avatar */}
      <Avatar
        src={user?.avatar_url || undefined}
        imgProps={{
          style: {
            objectFit: "cover",
          },
        }}
        sx={{
          width: 110,
          height: 110,
          border: "4px solid #7e9fcd",
          backgroundColor: user?.avatar_url ? "transparent" : "#1A4D96",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        {!user?.avatar_url && firstLetter}
      </Avatar>

      {/* Text */}
      <Box>
        <Typography
          sx={{
            color: "#6B7280",
            fontSize: "14px",
            mb: 0.5,
          }}
        >
          {today}
        </Typography>

        <Typography
          sx={{
            color: "#1A4D96",
            fontSize: { xs: "16px", md: "20px", lg: "22px" },
            fontWeight: 700,
          }}
        >
          Welcome back, Teacher {firstName} !
        </Typography>
      </Box>
    </Box>
  );
}
