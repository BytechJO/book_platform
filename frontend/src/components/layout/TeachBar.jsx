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
import KeyIcon from "@mui/icons-material/Key";
import { useGetTeacherNotifications } from "../../api/teacherActivities";
import NotificationMenu from "../notifications/NotificationMenu";
import { useGetStudentNotifications } from "../../api/studentActivities";
import useRateLimitCountdown from "../../hooks/useRateLimitCountdown";
import QrScanButton from "../QrScanButton";
import { useDashboardLanguage } from "../../contexts/dashboardLanguage";

export default function TeachBar() {
  const { t } = useDashboardLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const [activationError, setActivationError] = useState("");
  const [showActivationRateLimit, setShowActivationRateLimit] = useState(false);
  const { refetch } = useGetMyBooks();
  const isExactActive = (path) => location.pathname === path;
  const isStartsWithActive = (path) =>
    location.pathname.toLowerCase().startsWith(path.toLowerCase());
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const role = localStorage.getItem("role");
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");
  const { notifications } =
    role === "teacher"
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useGetTeacherNotifications()
      : role === "student"
        ? // eslint-disable-next-line react-hooks/rules-of-hooks
          useGetStudentNotifications()
        : { notifications: [] };
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const { user } = useAuthMe();

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [activationCode, setActivationCode] = useState("");
  const [activateLoading, setActivateLoading] = useState(false);
  const bookActivationLimit = useRateLimitCountdown("book-activation", t);
  const closeActivationDialog = () => {
    setOpenDialog(false);
    setActivationCode("");
    setActivationError("");
    setShowActivationRateLimit(false);
  };
  const handleActivateCode = async (e) => {
    e.preventDefault();

    if (!activationCode.trim()) {
      setActivationError(t("Please enter a valid activation code"));
      return;
    }

    try {
      setActivateLoading(true);
      setActivationError("");

      await axiosInstance.post(ENDPOINTS.User_book.Create, {
        code: activationCode,
      });
      bookActivationLimit.clearRateLimit();
      refetch();
      closeActivationDialog();
    } catch (err) {
      console.error(err);

      if (bookActivationLimit.startFromError(err)) {
        setActivationError("");
        setShowActivationRateLimit(true);
        return;
      }

      const message = err.response?.data?.message || t("Invalid activation code");

      setActivationError(message);
    } finally {
      setActivateLoading(false);
    }
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#23466f" : "#1A4D96",
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
              navigate(`/${role}`);
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
              {t("Home")}
            </Box>

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
              {t("Books")}
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
              {t("Help")}
            </Box>
            <Box
              onClick={() => navigate(`/${role}/events`)}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: "20px",
                backgroundColor: isStartsWithActive(`/${role}/events`)
                  ? "white"
                  : "transparent",
                color: isStartsWithActive(`/${role}/events`)
                  ? "#1A4D96"
                  : "white",
                fontWeight: 500,
                cursor: "pointer",
                transition: "0.2s",
                fontSize: 13,
                "&:hover": {
                  backgroundColor: isStartsWithActive(`/${role}/events`)
                    ? "white"
                    : "rgba(255,255,255,0.1)",
                },
              }}
            >
              {t("Events")}
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
              {t("Activate Code")}
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
          <NotificationMenu
            items={notifications}
            title={t("Notifications")}
            emptyText={t("No notifications")}
          />
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
              {t("Logout")}
            </MenuItem>
          </Menu>
        </Box>
        <Dialog
          open={openDialog}
          onClose={closeActivationDialog}
          maxWidth="sm"
          fullWidth
          BackdropProps={{
            sx: { backgroundColor: "rgba(0,0,0,0.6)" },
          }}
          PaperProps={{
            component: "form",
            onSubmit: handleActivateCode,
            sx: {
              borderRadius: "20px",
              p: 4,
              textAlign: "center",
            },
          }}
        >
          {/* ICON */}
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: (theme) =>
                theme.palette.mode === "dark" ? "rgba(138,180,248,0.14)" : "#e8f0fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 2,
            }}
          >
            <KeyIcon sx={{ color: "primary.main", fontSize: 32 }} />
          </Box>
          {/* TITLE */}
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 700,
              color: "primary.main",
              mb: 1,
            }}
          >
            {t("Activate Code")}
          </Typography>

          {/* DESCRIPTION */}
          <Typography
            sx={{
              fontSize: 14,
              color: "text.secondary",
              mb: 3,
            }}
          >
            {t("Enter your activation code to access your class or content.")}
          </Typography>

          {/* INPUT LABEL */}
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              mb: 1,
              textAlign: "start",
            }}
          >
            {t("Activation Code *")}
          </Typography>

          {/* INPUT */}
          <TextField
            fullWidth
            value={activationCode}
            onChange={(e) => {
              setActivationCode(e.target.value);
              if (activationError) setActivationError("");
            }}
            placeholder={t("Enter activation code")}
            error={
              Boolean(activationError) ||
              (showActivationRateLimit && bookActivationLimit.isRateLimited)
            }
            helperText={
              showActivationRateLimit && bookActivationLimit.isRateLimited
                ? bookActivationLimit.message
                : activationError
            }
            InputProps={{
              endAdornment: (
                <QrScanButton
                  kind="book"
                  title="Scan book QR code"
                  onScan={({ code }) => {
                    setActivationCode(code);
                    setActivationError("");
                  }}
                />
              ),
              sx: {
                height: 50,
                borderRadius: "10px",
                backgroundColor: "action.hover",
              },
            }}
          />

          {/* BUTTONS */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 4,
            }}
          >
            <LoadingButton
              type="submit"
              loading={activateLoading}
              variant="contained"
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "#244a87",
                },
              }}
            >
              {t("Activate")}
            </LoadingButton>

            <Button
              onClick={closeActivationDialog}
              variant="contained"
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "action.selected",
                color: "text.primary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              {t("Cancel")}
            </Button>
          </Box>
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
            <Button
              onClick={() => {
                navigate(`/${role}`);
                setMobileOpen(false); // 👈 سكر الدراور
              }}
            >
              {t("Home")}
            </Button>
            <Button
              onClick={() => {
                navigate(`/${role}/books`);
                setMobileOpen(false);
              }}
            >
              {t("Books")}
            </Button>

            <Button
              onClick={() => {
                navigate(`/${role}/help`);
                setMobileOpen(false);
              }}
            >
              {t("Help")}
            </Button>

            <Button
              onClick={() => {
                setOpenDialog(true);
                setMobileOpen(false);
              }}
            >
              {t("Activate Code")}
            </Button>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
