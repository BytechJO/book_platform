import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
} from "@mui/material";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import MenuIcon from "@mui/icons-material/Menu";

import logo from "../../assets/logo.svg";

export default function TeachBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar position="fixed" color="inherit" elevation={0}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: 80, md: 150 }, // 👈 responsive
            px: { xs: 2, md: 4 },
            alignItems: "center",
          }}
        >
          {/* LEFT */}
          <Box display="flex" alignItems="center" gap={{ xs: 1, md: 4 }}>
            {/* MENU (mobile only) */}
            <IconButton
              sx={{ display: { xs: "block", md: "none" } }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* LOGO */}
            <img
              src={logo}
              alt="logo"
              onClick={() => navigate(`/`)}
              style={{ cursor: "pointer" }}
              width={window.innerWidth < 600 ? 120 : 250} // 👈 responsive
            />

            {/* NAV (desktop only) */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 3,
                ml: 2,
              }}
            >
              <NavItem to="/" label="Home" />
              <NavItem to="/about" label="About Us" />
              <NavItem to="/book-series" label="Book series" />
              <NavItem to="/contact" label="Contact" />
            </Box>
          </Box>

          {/* RIGHT ICONS */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, md: 1.5 },
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

      {/* MOBILE DRAWER */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            <ListItem>
              <NavItem to="/" label="Home" />
            </ListItem>
            <ListItem>
              <NavItem to="/about" label="About Us" />
            </ListItem>
            <ListItem>
              <NavItem to="/book-series" label="Book series" />
            </ListItem>
            <ListItem>
              <NavItem to="/contact" label="Contact" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

/* ---------- Social Icon ---------- */

function SocialIcon({ children }) {
  return (
    <IconButton
      sx={{
        color: "#000000",
        width: { xs: 22, md: 36 },
        height: { xs: 22, md: 36 },
        p: 0,
        "& svg": {
          fontSize: { xs: 14, md: 20 },
        },
      }}
    >
      {children}
    </IconButton>
  );
}

/* ---------- Nav Item ---------- */

function NavItem({ to, label }) {
  return (
    <NavLink to={to} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <Button
          sx={{
            color: isActive ? "#1E4DB7" : "#000000",
            borderRadius: 20,
            px: { xs: 1.5, md: 2 },
            py: 0.5,
            fontSize: {
              xs: 12,
              sm: 13,
              md: 14,
              lg: 16,
            },
            width: { xs: "100%", md: "auto" }, // 👈 مهم للموبايل
            justifyContent: { xs: "flex-start", md: "center" },
            textTransform: "none",
            fontWeight: isActive ? 700 : 400,
            backgroundColor: isActive ? "#EAF1FF" : "transparent",
            "&:hover": {
              backgroundColor: "#EAF1FF",
            },
          }}
        >
          {label}
        </Button>
      )}
    </NavLink>
  );
}
