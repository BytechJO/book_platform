import { Typography } from "@mui/material";

export default function NotificationEmpty({ text = "No notifications" }) {
  return (
    <Typography color="text.secondary" sx={{ p: 1 }}>
      {text}
    </Typography>
  );
}
