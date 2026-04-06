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
        height: { xs: 48, sm: 52, md: 60, lg: 64 },
        justifyContent: "center",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "unset",
          width: "100%",
          px: { xs: 1.2, sm: 2, md: 4, lg: 6 },
          pl: { xs: 1.2, sm: 2, md: 8, lg: 16 },
          pr: { xs: 1.5, sm: 2, md: 4, lg: 6 },
          overflow: "hidden",
        }}
      >
        {/* LEFT SIDE */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minWidth: 0,
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.2, sm: 0.5, md: 1.2, lg: 2 },
              flexWrap: "nowrap",
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
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
            justifyContent: "flex-end",
            flexShrink: 0,
            gap: { xs: 0.2, sm: 0.4, md: 0.8, lg: 1 },
            ml: { xs: 0.5, sm: 1, md: 2 },
            pr: { xs: 0.5, sm: 0.5, md: 0 },
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
    <NavLink to={to} style={{ textDecoration: "none", flexShrink: 0 }}>
      <Button
        sx={{
          color: isActive ? "#1A4D96" : "white",
          backgroundColor: isActive ? "white" : "transparent",
          borderRadius: "20px",
          minWidth: "auto",
          textTransform: "none",
          fontWeight: 500,
          whiteSpace: "nowrap",
          lineHeight: 1.1,

          px: { xs: 0.7, sm: 1, md: 1.8, lg: 2.2 },
          py: { xs: 0.3, sm: 0.45, md: 0.6 },
          fontSize: {
            xs: "8px",
            sm: "10px",
            md: "13px",
            lg: "15px",
            xl: "16px",
          },

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
        flexShrink: 0,
        p: 0,

        width: { xs: 20, sm: 24, md: 32, lg: 36 },
        height: { xs: 20, sm: 24, md: 32, lg: 36 },

        "& svg": {
          fontSize: { xs: 12, sm: 14, md: 18, lg: 20 },
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
