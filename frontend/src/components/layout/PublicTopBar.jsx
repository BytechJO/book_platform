import React from "react";
import { AppBar, Toolbar, Box, Button, IconButton } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function PublicTopBar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1A4D96",
        height: 50,
        justifyContent: "center",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          pl: { xs: 2, md: 16 },
          pr: { xs: 2, md: 4 },
        }}
      >
        {/* Navigation */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <NavItem to="/" label="Home" />
          <NavItem to="/about" label="About Us" />
          <NavItem to="/book-series" label="Book series" />
          <NavItem to="/contact" label="Contact" />
        </Box>

        {/* Social Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SocialIcon>
            <FacebookIcon fontSize="small" />
          </SocialIcon>
          <SocialIcon>
            <TwitterIcon fontSize="small" />
          </SocialIcon>
          <SocialIcon>
            <InstagramIcon fontSize="small" />
          </SocialIcon>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

/* ---------- Nav Item ---------- */


function NavItem({ to, label }) {
  const location = useLocation();

  const isActive =
    to === "/"
      ? location.pathname === "/" || location.pathname.startsWith("/books")
      : location.pathname.startsWith(to);

  return (
    <NavLink to={to} style={{ textDecoration: "none" }}>
      <Button
        sx={{
          color: isActive ? "#1A4D96" : "white",
          backgroundColor: isActive ? "white" : "transparent",
          borderRadius: "20px",
          px: 2.5,
          py: 0.5,
          textTransform: "none",
          fontWeight: 500,
          minWidth: "auto",
          "&:hover": {
            backgroundColor: isActive ? "white" : "rgba(255,255,255,0.1)",
          },
        }}
      >
        {label}
      </Button>
    </NavLink>
  );
}

/* ---------- Social Icon ---------- */

function SocialIcon({ children }) {
  return (
    <IconButton
      sx={{
        color: "white",
        width: 36,
        height: 36,
        borderRadius: "50%",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.1)",
        },
      }}
    >
      {children}
    </IconButton>
  );
}
