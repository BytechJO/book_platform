import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useState, useEffect } from "react";

import ENDPOINTS from "src/api/endpoints";
import axiosInstance from "src/api/axios";
import { useAuthMe } from "../../api";

export default function UserProfile() {
  const { user, loading, refetch } = useAuthMe();

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
  const [initialData, setInitialData] = useState({
    full_name: "",
    email: "",
    avatar_url: "",
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

      if (image) formData.append("avatar", image);

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
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 6,
          px: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: 480,
            borderRadius: 3,
            p: 4,
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          }}
        >
          <Stack spacing={3}>
            {/* Header */}
            <Box textAlign="center">
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#2B5A9E",
                }}
              >
                Profile Settings
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  color: "#7A869A",
                  mt: 0.5,
                }}
              >
                Update your personal information
              </Typography>
            </Box>

            {/* Avatar */}
            <Box textAlign="center">
              <Avatar
                src={preview}
                sx={{
                  width: 120,
                  height: 120,
                  margin: "auto",
                  mb: 2,
                  border: "4px solid #f1f4f9",
                }}
              />

              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
              >
                Change Photo
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              {errors.avatar && (
                <Typography color="error" fontSize={13} mt={1}>
                  {errors.avatar}
                </Typography>
              )}
            </Box>

            {/* Full Name */}
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
            />

            {/* Email */}
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
            />

            {/* Save Button */}
            <LoadingButton
              variant="contained"
              loading={saving}
              onClick={handleSave}
              disabled={!isChanged}
              sx={{
                height: 46,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                backgroundColor: "#2B5A9E",
              }}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
