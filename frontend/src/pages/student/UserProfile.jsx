import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Stack,
  Snackbar,
  Alert,
  IconButton,
  Divider,
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
import SiteLoader from "src/components/SiteLoade";
import { Helmet } from "react-helmet-async";

export default function UserProfile() {
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

  const primaryColor = "#1A4D96";
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
    return <SiteLoader fullScreen text="Loading Books..." />;
  }

  return (
    <>
      <Helmet>
        <title>User Profile - Student Dashboard</title>
      </Helmet>
      <Divider
        sx={{
          width: "100%",
          borderColor: "#1A4D965C",
          mb: 2,
        }}
      />
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            maxWidth: 600,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(26, 77, 150, 0.15)",
          }}
        >
          <Box
            sx={{
              height: 100,
              background: `linear-gradient(135deg, ${primaryColor} 0%, #3a6fb0 100%)`,
              position: "relative",
              display: "flex",
              alignItems: "center",
              px: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: "bold",
                zIndex: 1,
              }}
            >
              My Profile
            </Typography>

            <Box
              sx={{
                position: "absolute",
                right: -50,
                top: -50,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
              }}
            />
          </Box>

          <Box sx={{ px: 4, pb: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: -8,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={preview}
                  sx={{
                    width: 140,
                    height: 140,
                    border: "5px solid white",
                    boxShadow: 3,
                    bgcolor: "#e0e0e0",
                  }}
                />
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                    bgcolor: primaryColor,
                    color: "white",
                    boxShadow: 2,
                    "&:hover": { bgcolor: "#143d7a" },
                  }}
                >
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Box>

              <Typography
                variant="h6"
                sx={{ mt: 2, fontWeight: 600, color: "#333" }}
              >
                {fullName || "User Name"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {email || "email@example.com"}
              </Typography>

              {errors.avatar && (
                <Typography color="error" fontSize={13} mt={1}>
                  {errors.avatar}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={3}>
              <TextField
                label="Full Name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrors((prev) => ({ ...prev, full_name: "" }));
                }}
                fullWidth
                variant="outlined"
                error={!!errors.full_name}
                helperText={errors.full_name}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, color: primaryColor }}>
                      <PersonIcon />
                    </Box>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: primaryColor },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: primaryColor },
                }}
              />

              <TextField
                label="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, color: primaryColor }}>
                      <EmailIcon />
                    </Box>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: primaryColor },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: primaryColor },
                }}
              />

              <LoadingButton
                variant="contained"
                size="large"
                loading={saving}
                onClick={handleSave}
                startIcon={<SaveIcon />}
                disabled={!isChanged}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: "16px",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: primaryColor,
                  boxShadow: `0 4px 12px rgba(26, 77, 150, 0.3)`,
                  "&:hover": {
                    bgcolor: "#143d7a",
                    boxShadow: `0 6px 16px rgba(26, 77, 150, 0.4)`,
                  },
                }}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Box>
        </Paper>
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
