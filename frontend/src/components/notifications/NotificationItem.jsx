import { Box, Typography } from "@mui/material";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function NotificationItem({ item }) {
  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 2,
        "&:hover": {
          background: "#f5f5f5",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {item.title}
      </Typography>

      <Typography
        sx={{
          fontSize: 12,
          color: "#666",
        }}
      >
        {item.description}
      </Typography>

      <Typography
        sx={{
          fontSize: 11,
          color: "#999",
          mt: 0.5,
        }}
      >
        {dayjs(item.created_at).fromNow()}
      </Typography>
    </Box>
  );
}
