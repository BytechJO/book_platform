import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import logoWhite from "../../assets/logo_white.svg";
import SettingsIcon from "../icons/SettingsIcon";
import UserIcon from "../icons/UserIcon";
import { Menu, MenuItem } from "@mui/material";
import { useAuthMe } from "src/api";
import NotificationMenu from "../notifications/NotificationMenu";
import { useGetNotifications } from "../../api/activities";
export default function DashBar() {
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
  const { notifications } = useGetNotifications();

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#1A4D96", boxShadow: "none" }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          height: { xs: 18, sm: 22, md: 30, lg: 35 },
          px: { xs: 1.5, md: 2 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={logoWhite}
            alt="logo"
            style={{
              height: window.innerWidth < 600 ? 28 : 32, // 👈 responsive
              cursor: "pointer",
            }}
            onClick={() => navigate("/admin/dashboard")}
          />
        </Box>

        {/* Right Side Icons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, md: 1.5 }, // 👈 أقل بالموبايل
          }}
        >
          {/* Settings */}
          <IconButton
            sx={{ color: "white" }}
            onClick={() => navigate("/admin/profile")}
          >
            <SettingsIcon size={24} />
          </IconButton>

          {/* Notifications */}
          <NotificationMenu items={notifications} />
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
