import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import SettingsIcon from "../icons/SettingsIcon";
import BellIcon from "../icons/BellIcon";
import UserIcon from "../icons/UserIcon";
import { Menu, MenuItem } from "@mui/material";
import { useAuthMe } from "src/api";
export default function TopBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useAuthMe();

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1A4D96",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          fontWeight="500"
          onClick={() => navigate("/admin/dashboard")}
          sx={{ cursor: "pointer", ml: 2 }}
          fontSize="34px"
        >
          Publisher Platform
        </Typography>

        {/* Right Side Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Settings */}
          <IconButton
            sx={{ color: "white" }}
            onClick={() => navigate("/admin/profile")}
          >
            <SettingsIcon size={26} />
          </IconButton>

          {/* Notifications */}
          <IconButton sx={{ color: "white", position: "relative" }}>
            <BellIcon size={26} />

            <Box
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                backgroundColor: "#FF4B55",
                color: "white",
                fontSize: 9,
                width: 16,
                height: 16,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              1
            </Box>
          </IconButton>

          {/* User */}
          {/* User */}
          <IconButton
            sx={{
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
            onClick={handleOpen}
          >
            {user?.avatar_url ? (
              <Avatar
                src={user.avatar_url}
                sx={{
                  width: 28,
                  height: 28,
                }}
              />
            ) : (
              <UserIcon size={26} />
            )}
            <KeyboardArrowDownIcon
              sx={{
                fontSize: 20,
                transition: "0.2s",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/");
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
