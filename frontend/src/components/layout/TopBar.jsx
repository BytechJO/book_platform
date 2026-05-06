import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  ListItemButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "../icons/SettingsIcon";
import BellIcon from "../icons/BellIcon";
import UserIcon from "../icons/UserIcon";
import { useAuthMe } from "src/api";
import logo from "../../assets/logo_white.svg";
import { useGetNotifications } from "../../api/activities";
import NotificationMenu from "../notifications/NotificationMenu";

export default function TopBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useAuthMe();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useGetNotifications();
  const open = Boolean(anchorEl);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Books", path: "/admin/books" },
    { label: "Codes", path: "/admin/codes" },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: "#1A4D96", boxShadow: "none" }}
    >
      <Toolbar>
        {/* LEFT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component="img"
            src={logo}
            alt="logo"
            onClick={() => navigate("/admin/dashboard")}
            sx={{
              height: { xs: 18, sm: 22, md: 30, lg: 35 },
              cursor: "pointer",
              mr: 6,
              ml: 6,
            }}
          />
        </Box>

        {/* NAV */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 2,
            ml: 4,
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Typography
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  cursor: "pointer",
                  fontSize: 15,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "20px",
                  transition: "0.2s",
                  backgroundColor: isActive ? "#FFFFFF" : "transparent",
                  color: isActive ? "#1A4D96" : "white",
                  "&:hover": {
                    backgroundColor: isActive
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.2)",
                  },
                }}
              >
                {item.label}
              </Typography>
            );
          })}
        </Box>

        {/* RIGHT */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            ml: "auto",
          }}
        >
          <IconButton
            sx={{ color: "white" }}
            onClick={() => navigate("/admin/profile")}
          >
            <SettingsIcon size={24} />
          </IconButton>

          <NotificationMenu items={notifications} />

          <IconButton
            sx={{
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 0.3,
            }}
            onClick={handleOpen}
          >
            {user?.avatar_url ? (
              <Avatar src={user.avatar_url} sx={{ width: 26, height: 26 }} />
            ) : (
              <UserIcon size={24} />
            )}

            <KeyboardArrowDownIcon
              sx={{
                fontSize: 18,
                transition: "0.2s",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
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

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box sx={{ width: 250 }}>
          <List>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                    sx={{
                      backgroundColor: isActive ? "#1A4D96" : "transparent",
                      color: isActive ? "white" : "#333",
                      borderRadius: "12px",
                      mx: 1,
                      my: 0.5,
                      px: 2,
                      py: 1,
                      "&:hover": {
                        backgroundColor: isActive ? "#1A4D96" : "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
