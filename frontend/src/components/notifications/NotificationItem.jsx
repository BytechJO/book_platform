import { Avatar, Box, ButtonBase, Stack, Typography } from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const notificationStyles = {
  user: {
    icon: PersonOutlineRoundedIcon,
    color: "#7c3aed",
    background: "rgba(124,58,237,0.12)",
  },
  book: {
    icon: MenuBookOutlinedIcon,
    color: "#2563eb",
    background: "rgba(37,99,235,0.12)",
  },
  code: {
    icon: KeyOutlinedIcon,
    color: "#d97706",
    background: "rgba(217,119,6,0.13)",
  },
  class: {
    icon: GroupsOutlinedIcon,
    color: "#0891b2",
    background: "rgba(8,145,178,0.12)",
  },
  event: {
    icon: EventOutlinedIcon,
    color: "#db2777",
    background: "rgba(219,39,119,0.12)",
  },
  note: {
    icon: NoteAltOutlinedIcon,
    color: "#16a34a",
    background: "rgba(22,163,74,0.12)",
  },
  resource: {
    icon: AttachFileOutlinedIcon,
    color: "#ea580c",
    background: "rgba(234,88,12,0.12)",
  },
};

export default function NotificationItem({ item, onClick }) {
  const visual = notificationStyles[item.type] || {
    icon: NotificationsNoneRoundedIcon,
    color: "#64748b",
    background: "rgba(100,116,139,0.12)",
  };
  const TypeIcon = visual.icon;

  return (
    <ButtonBase
      onClick={() => onClick(item)}
      sx={{
        display: "block",
        width: "100%",
        p: 1.25,
        mb: 0.5,
        borderRadius: 2.25,
        textAlign: "start",
        border: "1px solid transparent",
        transition:
          "background-color 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
        "&:last-of-type": { mb: 0 },
        "&:hover": {
          bgcolor: "action.hover",
          borderColor: "divider",
          transform: "translateY(-1px)",
          "& .notification-arrow": {
            opacity: 1,
            transform: (theme) =>
              theme.direction === "rtl"
                ? "translateX(2px) rotate(180deg)"
                : "translateX(2px)",
          },
        },
      }}
    >
      <Stack direction="row" sx={{ gap: 1.25 }} alignItems="flex-start">
        <Avatar
          variant="rounded"
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            color: visual.color,
            bgcolor: visual.background,
          }}
        >
          <TypeIcon fontSize="small" />
        </Avatar>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" alignItems="flex-start" spacing={0.5}>
            <Typography
              sx={{
                flex: 1,
                fontSize: 13.5,
                lineHeight: 1.35,
                fontWeight: 750,
                color: "text.primary",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.title}
            </Typography>
            <ChevronRightRoundedIcon
              className="notification-arrow"
              sx={{
                mt: -0.25,
                fontSize: 19,
                color: "text.secondary",
                opacity: 0.45,
                transform: (theme) =>
                  theme.direction === "rtl" ? "rotate(180deg)" : "none",
                transition: "0.18s ease",
              }}
            />
          </Stack>

          {item.description && (
            <Typography
              sx={{
                mt: 0.35,
                fontSize: 12.25,
                lineHeight: 1.45,
                color: "text.secondary",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.description}
            </Typography>
          )}

          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ mt: 0.75, color: "text.secondary" }}
          >
            <AccessTimeRoundedIcon sx={{ fontSize: 13 }} />
            <Typography variant="caption" sx={{ fontSize: 10.75 }}>
              {dayjs(item.created_at).fromNow()}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </ButtonBase>
  );
}
