import { Box, Typography } from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

export default function NotificationEmpty({
  text = "No notifications",
  subtitle = "New updates will appear here.",
}) {
  return (
    <Box sx={{ px: 3, py: 5, textAlign: "center" }}>
      <Box
        sx={{
          width: 58,
          height: 58,
          mx: "auto",
          mb: 1.5,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: "action.hover",
          color: "text.secondary",
        }}
      >
        <NotificationsNoneRoundedIcon sx={{ fontSize: 29 }} />
      </Box>
      <Typography fontWeight={700} color="text.primary">
        {text}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  );
}
