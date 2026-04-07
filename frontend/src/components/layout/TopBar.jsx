import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "../icons/SettingsIcon";
import BellIcon from "../icons/BellIcon";
import UserIcon from "../icons/UserIcon";
import {
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useAuthMe } from "src/api";
export default function TopBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useAuthMe();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Books", path: "/admin/books" },
    { label: "Codes", path: "/admin/codes" },
  ];
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1A4D96",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          onClick={() => navigate("/admin/dashboard")}
          sx={{
            cursor: "pointer",
            fontSize: { xs: 20, md: 28 },
            ml: { xs: 1, md: 2 },
          }}
        >
          Publisher Platform
        </Typography>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3,
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
                  fontSize: 16,
                  px: 2,
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
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
        }}
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
