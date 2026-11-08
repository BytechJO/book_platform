import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  Divider,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ENDPOINTS from "src/api/endpoints";
import axiosInstance from "src/api/axios";
import { useAuthMe } from "../../api";
import CurveLoader from "../CurveLoader";
import { useDashboardLanguage } from "../../contexts/dashboardLanguage";

export default function DashboardSettingsPage({ role, mode, changeMode }) {
  const { language, changeLanguage, t } = useDashboardLanguage();
  const { user, loading, refetch } = useAuthMe();
  const [activeSection, setActiveSection] = useState("account");
  const [initialData, setInitialData] = useState({ full_name: "", email: "" });
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
    if (!user) return;
    setFullName(user.full_name || "");
    setEmail(user.email || "");
    setPreview(user.avatar_url || null);
    setInitialData({
      full_name: user.full_name || "",
      email: user.email || "",
    });
  }, [user]);

  const isChanged =
    fullName !== initialData.full_name ||
    email !== initialData.email ||
    image !== null;

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setErrors((previous) => ({ ...previous, avatar: "" }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrors({});
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("email", email);
      if (image) formData.append("avatar", image);

      const response = await axiosInstance.put(
        ENDPOINTS.AUTH.UPDATE_PROFILE,
        formData,
      );
      setPreview(response.data.avatar_url);
      setImage(null);
      setInitialData({ full_name: fullName, email });
      refetch();
      setSnackbar({
        open: true,
        message: t("Profile updated successfully"),
        severity: "success",
      });
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors) setErrors(apiErrors);
      else
        setSnackbar({
          open: true,
          message: t("Something went wrong"),
          severity: "error",
        });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CurveLoader />;

  return (
    <>
      <Helmet>
        <title>
          {t("Settings")} - {role === "student" ? t("Student") : t("Teacher")}{" "}
          Dashboard
        </title>
      </Helmet>

      <Box
        sx={{
          p: { xs: 2, md: 4 },
          minHeight: "80vh",
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1120, mx: "auto" }}>
          <Typography
            sx={{
              fontSize: { xs: 28, md: 34 },
              fontWeight: 800,
              color: "primary.main",
            }}
          >
            {t("Settings")}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
            {t("Manage your account information and dashboard preferences.")}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "270px minmax(0, 1fr)" },
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 16px 38px rgba(0,0,0,0.4)"
                  : "0 12px 32px rgba(26,77,150,0.09)",
            }}
          >
            <Box
              sx={{
                p: 2.5,
                bgcolor: "action.hover",
                borderInlineEnd: { md: "1px solid" },
                borderBottom: { xs: "1px solid", md: "none" },
                borderColor: "divider",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row", md: "column" }}
                spacing={2}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  <Avatar
                    src={preview}
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: "primary.main",
                      fontWeight: 700,
                    }}
                  >
                    {!preview && fullName?.charAt(0)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={700} noWrap>
                      {fullName || t("User Name")}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      display="block"
                    >
                      {email}
                    </Typography>
                    <Chip
                      label={t(user?.role || role)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mt: 0.7, height: 22, textTransform: "capitalize" }}
                    />
                  </Box>
                </Stack>

                <Divider
                  sx={{ display: { xs: "block", sm: "none", md: "block" } }}
                />

                <Stack
                  direction={{ xs: "row", md: "column" }}
                  sx={{ gap: 2, overflowX: "auto", pb: { xs: 0.5, md: 0 } }}
                >
                  <SettingsNavButton
                    active={activeSection === "account"}
                    icon={<ManageAccountsOutlinedIcon />}
                    label={t("Account")}
                    onClick={() => setActiveSection("account")}
                  />
                  <SettingsNavButton
                    active={activeSection === "appearance"}
                    icon={<PaletteOutlinedIcon />}
                    label={t("Appearance")}
                    onClick={() => setActiveSection("appearance")}
                  />
                  <SettingsNavButton
                    active={activeSection === "language"}
                    icon={<LanguageOutlinedIcon />}
                    label={t("Language")}
                    onClick={() => setActiveSection("language")}
                    language={language}
                  />
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ p: { xs: 2.5, sm: 4 }, minHeight: 490 }}>
              {activeSection === "account" && (
                <Box>
                  <SectionHeading
                    title={t("Account settings")}
                    subtitle={t(
                      "Update your profile photo and personal information.",
                    )}
                  />
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={{
                      my: 4,
                      gap: 2.5,
                    }}
                  >
                    <Avatar
                      src={preview}
                      sx={{
                        width: 92,
                        height: 92,
                        bgcolor: "primary.main",
                        fontSize: 30,
                      }}
                    >
                      {!preview && fullName?.charAt(0)}
                    </Avatar>

                    <Box>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<PhotoCameraIcon />}
                        sx={{
                          textTransform: "none",
                          gap: 1,
                          "& .MuiButton-startIcon": {
                            margin: 0,
                          },
                        }}
                      >
                        {t("Change photo")}
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </Button>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        {t("JPG or PNG. A square image works best.")}
                      </Typography>

                      {errors.avatar && (
                        <Typography color="error" fontSize={13} mt={0.5}>
                          {errors.avatar}
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 3 }} />
                  <Stack spacing={2.5}>
                    <TextField
                      label={t("Full Name")}
                      value={fullName}
                      onChange={(event) => {
                        setFullName(event.target.value);
                        setErrors((previous) => ({
                          ...previous,
                          full_name: "",
                        }));
                      }}
                      fullWidth
                      error={!!errors.full_name}
                      helperText={errors.full_name}
                      InputProps={{
                        startAdornment: (
                          <PersonIcon sx={{ mx: 1, color: "primary.main" }} />
                        ),
                      }}
                    />
                    <TextField
                      label={t("Email Address")}
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setErrors((previous) => ({ ...previous, email: "" }));
                      }}
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <EmailIcon sx={{ mx: 1, color: "primary.main" }} />
                        ),
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <LoadingButton
                        variant="contained"
                        loading={saving}
                        onClick={handleSave}
                        startIcon={<SaveIcon />}
                        disabled={!isChanged}
                        sx={{
                          px: 3,
                          py: 1.2,
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: 700,

                          gap: 1,

                          "& .MuiButton-startIcon": {
                            margin: 0,
                          },
                        }}
                      >
                        {t("Save Changes")}
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Box>
              )}

              {activeSection === "appearance" && (
                <Box>
                  <SectionHeading
                    title={t("Appearance")}
                    subtitle={t(
                      "Select the theme used across your dashboard. Your choice is saved automatically.",
                    )}
                  />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2.5,
                      mt: 4,
                    }}
                  >
                    <ThemeOption
                      mode="light"
                      selected={mode === "light"}
                      onClick={() => changeMode("light")}
                      t={t}
                    />
                    <ThemeOption
                      mode="dark"
                      selected={mode === "dark"}
                      onClick={() => changeMode("dark")}
                      t={t}
                    />
                  </Box>
                </Box>
              )}

              {activeSection === "language" && (
                <Box>
                  <SectionHeading
                    title={t("Language")}
                    subtitle={t(
                      "Choose the language used across your dashboard.",
                    )}
                  />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2.5,
                      mt: 4,
                    }}
                  >
                    <LanguageOption
                      title="English"
                      subtitle={t("English interface")}
                      abbreviation="EN"
                      selected={language === "en"}
                      onClick={() => changeLanguage("en")}
                    />
                    <LanguageOption
                      title="العربية"
                      subtitle={t("Arabic interface with RTL support")}
                      abbreviation="ع"
                      selected={language === "ar"}
                      onClick={() => changeLanguage("ar")}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((previous) => ({ ...previous, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((previous) => ({ ...previous, open: false }))
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <Box>
      <Typography variant="h5" fontWeight={800}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

function SettingsNavButton({ active, icon, label, onClick, language }) {
  return (
    <Button
      onClick={onClick}
      startIcon={icon}
      sx={{
        justifyContent: "flex-start",
        minWidth: { xs: "max-content", md: "100%" },
        px: 1.5,
        py: 1.1,
        borderRadius: 2,
        textTransform: "none",
        fontWeight: active ? 700 : 500,
        color: active ? "primary.main" : "text.secondary",
        bgcolor: active ? "action.selected" : "transparent",

        "& .MuiButton-startIcon": {
          marginLeft: language === "ar" ? "8px" : 0,
          marginRight: language === "ar" ? 0 : "8px",
        },

        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      {label}
    </Button>
  );
}

function ThemeOption({ mode, selected, onClick, t }) {
  const isDark = mode === "dark";
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: "block",
        width: "100%",
        p: 1.5,
        textAlign: "start",
        border: "2px solid",
        borderColor: selected ? "primary.main" : "divider",
        borderRadius: 3,
        bgcolor: selected ? "action.selected" : "transparent",
        transition: "0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
        },
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
        <Box sx={{ height: 28, bgcolor: isDark ? "#315b88" : "#1A4D96" }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "42px 1fr",
            height: "calc(100% - 28px)",
          }}
        >
          <Box
            sx={{
              bgcolor: isDark ? "#182235" : "#e9eef6",
              borderInlineEnd: "1px solid",
              borderColor: isDark ? "#334155" : "#dce3ec",
            }}
          />
          <Box sx={{ p: 1.5 }}>
            <Box
              sx={{
                height: 12,
                width: "55%",
                borderRadius: 1,
                bgcolor: isDark ? "#8ab4f8" : "#2B5A9E",
                mb: 1.5,
              }}
            />
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}
            >
              {[1, 2, 3, 4].map((item) => (
                <Box
                  key={item}
                  sx={{
                    height: 38,
                    borderRadius: 1.5,
                    bgcolor: isDark ? "#243147" : "#fff",
                    boxShadow: "0 2px 7px rgba(0,0,0,0.08)",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.2}
        sx={{ pt: 1.5, px: 0.5 }}
      >
        <Box
          sx={{
            color: selected ? "primary.main" : "text.secondary",
            display: "flex",
          }}
        >
          {isDark ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700}>
            {t(isDark ? "Dark mode" : "Light mode")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t(
              isDark
                ? "Comfortable in low light"
                : "Bright and clean interface",
            )}
          </Typography>
        </Box>
        {selected && <CheckCircleRoundedIcon color="primary" />}
      </Stack>
    </ButtonBase>
  );
}

function LanguageOption({ title, subtitle, abbreviation, selected, onClick }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: "100%",
        p: 2.5,
        textAlign: "start",
        direction: "ltr",
        border: "2px solid",
        borderColor: selected ? "primary.main" : "divider",
        borderRadius: 3,
        bgcolor: selected ? "action.selected" : "transparent",
        transition: "0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          width: "100%",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 52,
            height: 52,
            flexShrink: 0,
            bgcolor: selected ? "primary.main" : "action.hover",
            color: selected ? "primary.contrastText" : "text.primary",
            fontWeight: 800,
          }}
        >
          {abbreviation}
        </Avatar>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            textAlign: "left",
          }}
        >
          <Typography fontWeight={800}>{title}</Typography>

          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        {selected && (
          <CheckCircleRoundedIcon color="primary" sx={{ flexShrink: 0 }} />
        )}
      </Stack>
    </ButtonBase>
  );
}
