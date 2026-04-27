import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import logo from "../../assets/logo_white.svg";
import SettingsIcon from "../icons/SettingsIcon";
import BellIcon from "../icons/BellIcon";
import UserIcon from "../icons/UserIcon";
import { Menu, MenuItem, Drawer, useMediaQuery } from "@mui/material";
import axiosInstance from "../../api/axios";
import ENDPOINTS from "../../api/endpoints";
import { LoadingButton } from "@mui/lab";
import { useGetMyBooks } from "../../api/user_books";
import { useAuthMe } from "../../api";
import MenuIcon from "@mui/icons-material/Menu";

export default function TeachBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const [activationError, setActivationError] = useState("");
  const { refetch } = useGetMyBooks();
  const isExactActive = (path) => location.pathname === path;
  const isStartsWithActive = (path) => location.pathname.startsWith(path);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const role = localStorage.getItem("role");
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const { user } = useAuthMe();

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [activationCode, setActivationCode] = useState("");
  const [activateLoading, setActivateLoading] = useState(false);

  const handleActivateCode = async (e) => {
    e.preventDefault();

    if (!activationCode.trim()) {
      setActivationError("Please enter a valid activation code");
      return;
    }

    try {
      setActivateLoading(true);
      setActivationError("");

      await axiosInstance.post(ENDPOINTS.User_book.Create, {
        code: activationCode,
      });
      refetch();
      setOpenDialog(false);
      setActivationCode("");
    } catch (err) {
      console.error(err);

      const message = err.response?.data?.message || "Invalid activation code";

      setActivationError(message);
    } finally {
      setActivateLoading(false);
    }
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1A4D96",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          height: { xs: 50, md: 60 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 2 : 4,
          }}
        >
          {isMobile && (
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ color: "white" }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <img
            onClick={() => {
              if (role === "teacher") {
                navigate(`/${role}`);
              } else if (role === "student") {
                navigate(`/${role}/books`);
              }
            }}
            src={logo}
            alt="logo"
            style={{
              height: isMobile ? 30 : 40,
              width: isMobile ? 150 : 250,
              cursor: "pointer",
              marginRight: isMobile ? 10 : 20,
              marginLeft: isMobile ? 0 : 60,
            }}
          />
          <Box
            sx={{
              display: isMobile ? "none" : "flex",
              alignItems: "center",
              gap: 3,
              ml: 2,
            }}
          >
            {/* Home */}
            {role === "teacher" && (
              <Box
                onClick={() => navigate(`/${role}`)}
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: "20px",
                  backgroundColor: isExactActive(`/${role}`)
                    ? "white"
                    : "transparent",
                  color: isExactActive(`/${role}`) ? "#1A4D96" : "white",
                  fontWeight: 500,
                  fontSize: 13,
                  "&:hover": {
                    backgroundColor: isExactActive(`/${role}`)
                      ? "white"
                      : "rgba(255,255,255,0.1)",
                  },
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                Home
              </Box>
            )}

            {/* Books */}
            <Box
              onClick={() => navigate(`/${role}/books`)}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: "20px",
                backgroundColor: isStartsWithActive(`/${role}/books`)
                  ? "white"
                  : "transparent",
                color: isStartsWithActive(`/${role}/books`)
                  ? "#1A4D96"
                  : "white",
                "&:hover": {
                  backgroundColor: isStartsWithActive(`/${role}/books`)
                    ? "white"
                    : "rgba(255,255,255,0.1)",
                },
                fontWeight: 400,
                cursor: "pointer",
                transition: "0.2s",
                fontSize: 14,
              }}
            >
              Books
            </Box>

            {/* Help */}
            <Box
              onClick={() => navigate(`/${role}/help`)}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: "20px",
                backgroundColor: isStartsWithActive(`/${role}/help`)
                  ? "white"
                  : "transparent",
                color: isStartsWithActive(`/${role}/help`)
                  ? "#1A4D96"
                  : "white",
                fontWeight: 500,
                cursor: "pointer",
                transition: "0.2s",
                fontSize: 13,
                "&:hover": {
                  backgroundColor: isStartsWithActive(`/${role}/help`)
                    ? "white"
                    : "rgba(255,255,255,0.1)",
                },
              }}
            >
              Help
            </Box>
            <Box
              onClick={() => setOpenDialog(true)}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: "20px",
                backgroundColor: "transparent",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
                fontWeight: 400,
                cursor: "pointer",
                transition: "0.2s",
                fontSize: 14,
              }}
            >
              Activate Code
            </Box>
          </Box>
        </Box>

        {/* Right Side Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Settings */}
          <IconButton
            sx={{ color: "white" }}
            onClick={() => navigate(`/${role}/profile`)}
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
          <IconButton
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "white",
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
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          BackdropProps={{
            sx: {
              backgroundColor: "rgba(0,0,0,0.8)",
            },
          }}
          PaperProps={{
            component: "form",
            onSubmit: handleActivateCode,
            sx: {
              width: "700px",
              maxWidth: "100%",
              borderRadius: "30px",
              p: 3,
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              fontWeight: 600,
              color: "#2d5aa7",
              fontSize: 20,
            }}
          >
            Activate Code
          </DialogTitle>

          <DialogContent sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 500,
                mb: 1,
                color: "#7A869A",
              }}
            >
              Activation Code *
            </Typography>

            <TextField
              fullWidth
              value={activationCode}
              onChange={(e) => {
                setActivationCode(e.target.value);
                if (activationError) setActivationError("");
              }}
              placeholder="Enter activation code"
              error={Boolean(activationError)}
              helperText={activationError}
              InputProps={{
                sx: {
                  height: 56,
                  borderRadius: "12px",
                  backgroundColor: "#F9FBFF",
                },
              }}
            />
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              gap: 3,
              pb: 5,
            }}
          >
            <LoadingButton
              type="submit"
              loading={activateLoading}
              variant="contained"
              sx={{
                width: 126,
                height: 59,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 16,
                backgroundColor: "#466FAA",
                color: "#FFFFFF",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#3D6399",
                  boxShadow: "none",
                },
              }}
            >
              Activate
            </LoadingButton>

            <Button
              onClick={() => setOpenDialog(false)}
              variant="contained"
              sx={{
                width: 126,
                height: 59,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 16,
                backgroundColor: "#ECECEC",
                color: "#2B5A9E",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#DCDCDC",
                  boxShadow: "none",
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{
            sx: {
              width: "50%", // نص الشاشة تقريباً
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
              p: 3,
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {role === "teacher" && (
              <Button
                onClick={() => {
                  navigate(`/${role}`);
                  setMobileOpen(false); // 👈 سكر الدراور
                }}
              >
                Home
              </Button>
            )}
            <Button
              onClick={() => {
                navigate(`/${role}/books`);
                setMobileOpen(false);
              }}
            >
              Books
            </Button>

            <Button
              onClick={() => {
                navigate(`/${role}/help`);
                setMobileOpen(false);
              }}
            >
              Help
            </Button>

            <Button
              onClick={() => {
                setOpenDialog(true);
                setMobileOpen(false);
              }}
            >
              Activate Code
            </Button>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
