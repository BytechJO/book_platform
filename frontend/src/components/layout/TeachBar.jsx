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
import logo from "../../assets/logo.svg";
import SettingsIcon from "../icons/SettingsIcon";
import BellIcon from "../icons/BellIcon";
import UserIcon from "../icons/UserIcon";
import { Menu, MenuItem } from "@mui/material";
import axiosInstance from "../../api/axios";
import ENDPOINTS from "../../api/endpoints";
import { LoadingButton } from "@mui/lab";
import { useGetMyBooks } from "../../api/user_books";
import { useAuthMe } from "../../api";
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
    <AppBar position="fixed" color="inherit" elevation={0}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: 150,
          px: 4,
          alignItems: "center",
          pt: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{ height: 40, cursor: "pointer", marginRight: 20 }}
            onClick={() => navigate(`/${role}`)}
            width={250}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              ml: 2,
            }}
          >
            {/* Home */}
            <Box
              onClick={() => navigate(`/${role}`)}
              sx={{
                px: 3,
                py: 0.8,
                borderRadius: "20px",
                backgroundColor: isExactActive(`/${role}`)
                  ? "#2f4f8f"
                  : "transparent",
                color: isExactActive(`/${role}`) ? "#fff" : "#535353",
                fontWeight: 400,
                fontFamily: "Poppins",
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              Home
            </Box>

            {/* Books */}
            <Box
              onClick={() => navigate(`/${role}/books`)}
              sx={{
                px: 3,
                py: 0.8,
                borderRadius: "20px",
                backgroundColor: isStartsWithActive(`/${role}/books`)
                  ? "#2f4f8f"
                  : "transparent",
                color: isStartsWithActive(`/${role}/books`)
                  ? "#fff"
                  : "#535353",
                fontWeight: 400,
                fontFamily: "Poppins",
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              Books
            </Box>

            {/* Help */}
            <Box
              onClick={() => navigate(`/${role}/help`)}
              sx={{
                px: 3,
                py: 0.8,
                borderRadius: "20px",
                backgroundColor: isStartsWithActive(`/${role}/help`)
                  ? "#2f4f8f"
                  : "transparent",
                color: isStartsWithActive(`/${role}/help`) ? "#fff" : "#535353",
                fontWeight: 400,
                fontFamily: "Poppins",
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              Help
            </Box>
            <Box
              onClick={() => setOpenDialog(true)}
              sx={{
                px: 3,
                py: 0.8,
                borderRadius: "20px",
                backgroundColor: "transparent",
                color: "#535353",
                fontWeight: 400,
                fontFamily: "Poppins",
                cursor: "pointer",
                transition: "0.2s",
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
            sx={{ color: "black" }}
            onClick={() => navigate("/student/profile")}
          >
            <SettingsIcon size={26} />
          </IconButton>
          {/* Notifications */}
          <IconButton sx={{ color: "black", position: "relative" }}>
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
          maxWidth="sm"
          fullWidth
          PaperProps={{
            component: "form",
            onSubmit: handleActivateCode,
            sx: {
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
      </Toolbar>
    </AppBar>
  );
}
