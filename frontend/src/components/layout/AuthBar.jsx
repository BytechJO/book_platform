import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, NavLink } from "react-router-dom";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

import logo from "../../assets/logo_white.svg";

export default function AuthBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#1A4D96",
          height: { xs: 50, md: 60 },
          justifyContent: "center",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            pl: { xs: 1, md: 16 },
            pr: { xs: 1, md: 4 },
            minHeight: "unset",
          }}
        >
          {/* LEFT SIDE */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* MENU BUTTON (mobile only) */}
            <IconButton
              onClick={() => setOpen(true)}
              sx={{ color: "white", display: { xs: "block", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* LOGO */}
            <Box
              component="img"
              src={logo}
              alt="logo"
              onClick={() => navigate("/")}
              sx={{
                height: { xs: 18, sm: 22, md: 30, lg: 35 },
                cursor: "pointer",
              }}
            />

            {/* DESKTOP NAV */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 2,
                ml: 2,
              }}
            >
              <NavItem to="/" label="Home" />
              <NavItem to="/about" label="About Us" />
              <NavItem to="/book-series" label="Book series" />
              <NavItem to="/contact" label="Contact" />
            </Box>
          </Box>

          {/* RIGHT SIDE */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.3, md: 1 },
            }}
          >
            <SocialIcon>
              <FacebookIcon />
            </SocialIcon>
            <SocialIcon>
              <TwitterIcon />
            </SocialIcon>
            <SocialIcon>
              <InstagramIcon />
            </SocialIcon>
          </Box>
        </Toolbar>
      </AppBar>

      {/* DRAWER (mobile only) */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            <ListItemButton onClick={() => handleNavigate("/")}>
              <ListItemText primary="Home" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigate("/about")}>
              <ListItemText primary="About Us" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigate("/book-series")}>
              <ListItemText primary="Book series" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigate("/contact")}>
              <ListItemText primary="Contact" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

/* ---------- Nav Item (desktop) ---------- */

function NavItem({ to, label }) {
  return (
    <NavLink to={to} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <Button
          sx={{
            color: isActive ? "#1A4D96" : "white",
            backgroundColor: isActive ? "white" : "transparent",
            borderRadius: "20px",
            px: 2,
            py: 0.5,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: isActive ? "white" : "rgba(255,255,255,0.1)",
            },
          }}
        >
          {label}
        </Button>
      )}
    </NavLink>
  );
}

/* ---------- Social Icon ---------- */

function SocialIcon({ children }) {
  return (
    <IconButton
      sx={{
        color: "white",
        width: { xs: 22, md: 36 },
        height: { xs: 22, md: 36 },
        p: 0,
        "& svg": {
          fontSize: { xs: 14, md: 20 },
        },
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.1)",
        },
      }}
    >
      {children}
    </IconButton>
  );
}
