import { useEffect, useState } from "react";

import { IconButton, Badge, Menu, Box, Typography } from "@mui/material";

import BellIcon from "../icons/BellIcon";

import NotificationItem from "./NotificationItem";
import NotificationEmpty from "./NotificationEmpty";
import { markAllActivitiesAsRead } from "../../api/activities";

export default function NotificationMenu({
  items = [],
  title = "Notifications",
}) {
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
  return (
    <>
      <IconButton sx={{ color: "white" }} onClick={handleOpen}>
        <Badge
          badgeContent={unreadCount}
          color="error"
          invisible={unreadCount === 0}
        >
          <BellIcon size={24} />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <Box sx={{ width: 340, p: 1 }}>
          <Typography
            sx={{
              fontWeight: 600,
              px: 1,
              py: 1,
            }}
          >
            {title}
          </Typography>

          {localItems?.length === 0 ? (
            <NotificationEmpty />
          ) : (
            localItems.map((item) => (
              <NotificationItem key={item.id} item={item} />
            ))
          )}
        </Box>
      </Menu>
    </>
  );
}
