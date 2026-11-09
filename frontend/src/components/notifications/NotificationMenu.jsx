import { useEffect, useState } from "react";

import {
  IconButton,
  Badge,
  Menu,
  Box,
  Typography,
  Chip,
  Divider,
  Stack,
} from "@mui/material";

import BellIcon from "../icons/BellIcon";

import NotificationItem from "./NotificationItem";
import NotificationEmpty from "./NotificationEmpty";
import { markAllActivitiesAsRead } from "../../api/activities";
import { useNavigate } from "react-router-dom";

export default function NotificationMenu({
  items = [],
  title = "Notifications",
  emptyText = "No notifications",
  emptySubtitle = "New updates will appear here.",
  countText,
  role,
}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [localItems, setLocalItems] = useState(items);
  useEffect(() => {
    setLocalItems(items);
  }, [items]);
  const open = Boolean(anchorEl);

  const unreadCount = localItems?.filter((a) => !a.is_read).length || 0;
  const handleOpen = async (e) => {
    setAnchorEl(e.currentTarget);

    if (unreadCount > 0) {
      setLocalItems((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: true,
        })),
      );

      await markAllActivitiesAsRead();
    }
  };

  const handleItemClick = (item) => {
    const destination = getNotificationDestination(item, role);
    setAnchorEl(null);
    navigate(destination.pathname, { state: destination.state });
  };
  return (
    <>
      <IconButton
        aria-label={title}
        sx={{
          color: "white",
          transition: "background-color 0.2s ease, transform 0.2s ease",
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.14)",
            transform: "translateY(-1px)",
          },
        }}
        onClick={handleOpen}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          invisible={unreadCount === 0}
        >
          <BellIcon size={25} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        MenuListProps={{ sx: { p: 0 } }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1.5,
              width: { xs: "calc(100vw - 24px)", sm: 390 },
              maxWidth: 390,
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 18px 50px rgba(0,0,0,0.55)"
                  : "0 18px 45px rgba(15,23,42,0.18)",
            },
          },
        }}
      >
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ px: 2.25, py: 1.75 }}
          >
            <Stack direction="row" alignItems="center" sx={{ gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  color: "primary.main",
                  bgcolor: "action.selected",
                }}
              >
                <BellIcon size={21} />
              </Box>
              <Box>
                <Typography fontWeight={800} fontSize={16}>
                  {title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {countText ||
                    (localItems.length === 1
                      ? "1 notification"
                      : `${localItems.length} notifications`)}
                </Typography>
              </Box>
            </Stack>

            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                color="error"
                sx={{ minWidth: 28, height: 24, fontWeight: 800 }}
              />
            )}
          </Stack>

          <Divider />

          {localItems?.length === 0 ? (
            <NotificationEmpty text={emptyText} subtitle={emptySubtitle} />
          ) : (
            <Box
              sx={{
                maxHeight: 430,
                overflowY: "auto",
                p: 1,
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(148,163,184,0.55) transparent",
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "rgba(148,163,184,0.55)",
                  borderRadius: 5,
                },
              }}
            >
              {localItems.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  onClick={handleItemClick}
                />
              ))}
            </Box>
          )}
        </Box>
      </Menu>
    </>
  );
}

function getNotificationDestination(item, role) {
  if (role === "admin") {
    if (item.type === "user" && item.actor_id) {
      return { pathname: `/admin/users/${item.actor_id}` };
    }

    if (item.type === "book") {
      return {
        pathname:
          item.book_id && item.action !== "delete"
            ? `/admin/books/${item.book_id}`
            : "/admin/books",
      };
    }

    if (item.type === "code") return { pathname: "/admin/codes" };
    return { pathname: "/admin/dashboard" };
  }

  const roleRoot = role === "teacher" ? "/teacher" : "/student";

  if (item.type === "event") {
    return {
      pathname: `${roleRoot}/events`,
      state: {
        selectedEventId: item.event_id,
        selectedDate: item.event_date,
      },
    };
  }

  if (["class", "note", "resource"].includes(item.type)) {
    return {
      pathname: item.class_id
        ? `${roleRoot}/classes/${item.class_id}`
        : `${roleRoot}/classes`,
    };
  }

  if (item.type === "book") {
    return {
      pathname: item.book_id
        ? `${roleRoot}/books/${item.book_id}`
        : `${roleRoot}/books`,
    };
  }

  return { pathname: `${roleRoot}/activities` };
}
