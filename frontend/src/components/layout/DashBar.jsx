import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import logoWhite from "../../assets/logo_white.svg";
import SettingsIcon from "../icons/SettingsIcon";
import BellIcon from "../icons/BellIcon";
import UserIcon from "../icons/UserIcon";
import { Menu, MenuItem } from "@mui/material";
export default function DashBar() {
  const [anchorEl, setAnchorEl] = useState(null);

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
      position="static"
      sx={{
        backgroundColor: "#1A4D96",
        boxShadow: "none",
        pt: 2.5,
        height: 40,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={logoWhite}
            alt="logo"
            style={{ height: 40, cursor: "pointer" }}
            onClick={() => navigate("/admin/dashboard")}
          />
        </Box>

        {/* Right Side Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Settings */}
          <IconButton sx={{ color: "white" }}>
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
          <IconButton
            sx={{
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
            onClick={handleOpen}
          >
            <UserIcon size={26} />
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
