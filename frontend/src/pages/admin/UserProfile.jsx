import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Stack,
  Snackbar,
  Alert,
  Divider,
  Button,
  Chip,
  ButtonBase,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState, useEffect } from "react";
import ENDPOINTS from "src/api/endpoints";
import axiosInstance from "src/api/axios";
import { useAuthMe } from "../../api";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import { Helmet } from "react-helmet-async";
import CurveLoader from "../../components/CurveLoader";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useAdminTheme } from "../../contexts/adminTheme";

export default function UserProfile() {
  const { mode, changeMode } = useAdminTheme();
  const [activeSection, setActiveSection] = useState("account");
  const { user, loading, refetch } = useAuthMe();
  const [initialData, setInitialData] = useState({
    full_name: "",
    email: "",
    avatar_url: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    avatar: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
      setPreview(user.avatar_url || null);

      setInitialData({
        full_name: user.full_name || "",
        email: user.email || "",
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user]);

  const isChanged =
    fullName !== initialData.full_name ||
    email !== initialData.email ||
    image !== null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, avatar: "" }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrors({});

      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("email", email);

      if (image) {
        formData.append("avatar", image);
      }

      const res = await axiosInstance.put(
        ENDPOINTS.AUTH.UPDATE_PROFILE,
        formData,
      );

      setPreview(res.data.avatar_url);
      refetch();
      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors) {
        setErrors(apiErrors);
      } else {
        setSnackbar({
          open: true,
          message: "Something went wrong",
          severity: "error",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <CurveLoader />;
  }

  return (
    <>
      <Helmet>
        <title>User Profile - Admin Dashboard</title>
      </Helmet>
      <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "80vh", bgcolor: "background.default" }}>
        <Box sx={{ width: "100%", maxWidth: 1120, mx: "auto" }}>
          <Typography sx={{ fontSize: { xs: 28, md: 34 }, fontWeight: 800, color: "primary.main" }}>
            Settings
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
            Manage your account information and dashboard preferences.
          </Typography>

          <Paper
            elevation={0}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "260px minmax(0, 1fr)" },
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 14px 34px rgba(0,0,0,0.38)"
                  : "0 12px 32px rgba(26,77,150,0.09)",
            }}
          >
            <Box
              sx={{
                p: 2.5,
                bgcolor: "action.hover",
                borderRight: { md: "1px solid" },
                borderBottom: { xs: "1px solid", md: "none" },
                borderColor: "divider",
              }}
            >
              <Stack direction={{ xs: "row", md: "column" }} spacing={2} alignItems={{ xs: "center", md: "stretch" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: { xs: 1, md: "initial" }, minWidth: 0 }}>
                  <Avatar src={preview} sx={{ width: 54, height: 54, bgcolor: "primary.main" }}>
                    {!preview && fullName?.charAt(0)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={700} noWrap>{fullName || "Admin"}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">{email}</Typography>
                    <Chip label={user?.role || "admin"} size="small" color="primary" variant="outlined" sx={{ mt: 0.7, height: 22, textTransform: "capitalize" }} />
                  </Box>
                </Stack>

                <Divider sx={{ display: { xs: "none", md: "block" } }} />

                <Stack direction={{ xs: "row", md: "column" }} spacing={0.7}>
                  <SettingsNavButton
                    active={activeSection === "account"}
                    icon={<ManageAccountsOutlinedIcon />}
                    label="Account"
                    onClick={() => setActiveSection("account")}
                  />
                  <SettingsNavButton
                    active={activeSection === "appearance"}
                    icon={<PaletteOutlinedIcon />}
                    label="Appearance"
                    onClick={() => setActiveSection("appearance")}
                  />
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
              {activeSection === "account" ? (
                <Box>
                  <Typography variant="h5" fontWeight={800}>Account settings</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Update your profile photo and personal information.
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ my: 4 }}>
                    <Avatar src={preview} sx={{ width: 88, height: 88, bgcolor: "primary.main", fontSize: 28 }}>
                      {!preview && fullName?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Button component="label" variant="outlined" startIcon={<PhotoCameraIcon />} sx={{ textTransform: "none" }}>
                        Change photo
                        <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                      </Button>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        JPG or PNG. A square image works best.
                      </Typography>
                      {errors.avatar && <Typography color="error" fontSize={13} mt={0.5}>{errors.avatar}</Typography>}
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={2.5}>
                    <TextField
                      label="Full Name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setErrors((prev) => ({ ...prev, full_name: "" }));
                      }}
                      fullWidth
                      error={!!errors.full_name}
                      helperText={errors.full_name}
                      InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1, color: "primary.main" }} /> }}
                    />
                    <TextField
                      label="Email Address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: "primary.main" }} /> }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <LoadingButton
                        variant="contained"
                        loading={saving}
                        onClick={handleSave}
                        startIcon={<SaveIcon />}
                        disabled={!isChanged}
                        sx={{ px: 3, py: 1.2, textTransform: "none", borderRadius: 2, fontWeight: 700 }}
                      >
                        Save changes
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h5" fontWeight={800}>Appearance</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 4 }}>
                    Select the theme used across the admin dashboard. Your choice is saved automatically.
                  </Typography>

                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                    <ThemeOption
                      mode="light"
                      selected={mode === "light"}
                      icon={<LightModeOutlinedIcon />}
                      onClick={() => changeMode("light")}
                    />
                    <ThemeOption
                      mode="dark"
                      selected={mode === "dark"}
                      icon={<DarkModeOutlinedIcon />}
                      onClick={() => changeMode("dark")}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

function SettingsNavButton({ active, icon, label, onClick }) {
  return (
    <Button
      fullWidth
      onClick={onClick}
      startIcon={icon}
      sx={{
        justifyContent: "flex-start",
        minWidth: { xs: "auto", md: "100%" },
        px: 1.5,
        py: 1.1,
        borderRadius: 2,
        textTransform: "none",
        fontWeight: active ? 700 : 500,
        color: active ? "primary.main" : "text.secondary",
        bgcolor: active ? "action.selected" : "transparent",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      {label}
    </Button>
  );
}

function ThemeOption({ mode, selected, icon, onClick }) {
  const isDark = mode === "dark";
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: "block",
        width: "100%",
        p: 1.5,
        textAlign: "left",
        border: "2px solid",
        borderColor: selected ? "primary.main" : "divider",
        borderRadius: 3,
        bgcolor: selected ? "action.selected" : "transparent",
        transition: "0.2s ease",
        "&:hover": { borderColor: "primary.main", transform: "translateY(-2px)" },
      }}
    >
      <Box
        sx={{
          height: 150,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: isDark ? "#0f172a" : "#f4f7fb",
          border: "1px solid",
          borderColor: isDark ? "#334155" : "#dce3ec",
        }}
      >
        <Box sx={{ height: 28, bgcolor: isDark ? "#23466f" : "#1A4D96" }} />
        <Box sx={{ display: "grid", gridTemplateColumns: "42px 1fr", height: "calc(100% - 28px)" }}>
          <Box sx={{ bgcolor: isDark ? "#182235" : "#e9eef6", borderRight: "1px solid", borderColor: isDark ? "#334155" : "#dce3ec" }} />
          <Box sx={{ p: 1.5 }}>
            <Box sx={{ height: 12, width: "55%", borderRadius: 1, bgcolor: isDark ? "#8ab4f8" : "#2B5A9E", mb: 1.5 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
              {[1, 2, 3, 4].map((item) => (
                <Box key={item} sx={{ height: 38, borderRadius: 1.5, bgcolor: isDark ? "#243147" : "#ffffff", boxShadow: "0 2px 7px rgba(0,0,0,0.08)" }} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Stack direction="row" alignItems="center" spacing={1.2} sx={{ pt: 1.5, px: 0.5 }}>
        <Box sx={{ color: selected ? "primary.main" : "text.secondary", display: "flex" }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700}>{isDark ? "Dark mode" : "Light mode"}</Typography>
          <Typography variant="caption" color="text.secondary">{isDark ? "Comfortable in low light" : "Bright and clean interface"}</Typography>
        </Box>
        {selected && <CheckCircleRoundedIcon color="primary" />}
      </Stack>
    </ButtonBase>
  );
}
