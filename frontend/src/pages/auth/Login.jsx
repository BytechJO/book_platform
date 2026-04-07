import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  InputAdornment,
  IconButton,
  CircularProgress,
  keyframes, // 1. استيراد keyframes
} from "@mui/material";
import { useEffect, useState } from "react";
import Logo2 from "../../assets/logo2.svg";
import login from "../../assets/login.svg";
import axiosInstance from "../../api/axios";
import ENDPOINTS from "../../api/endpoints";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme, useMediaQuery } from "@mui/material";

// 2. تعريف الأنيميشنز
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

export default function Login() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showPassword, setShowPassword] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email format"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (role === "teacher")
        navigate("/teacher/books", { replace: true });
      else if (role === "student")
        navigate("/student/books", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, data);
      if (response.data.user.status === "inactive") {
        setError("email", {
          type: "server",
          message:
            "Your account is inactive. Please contact the administrator.",
        });
        return;
      }
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      // eslint-disable-next-line react-hooks/immutability
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;

      if (user.role === "admin")
        navigate("/admin/dashboard", { replace: true });
      else if (user.role === "teacher")
        navigate("/teacher/books", { replace: true });
      else if (user.role === "student")
        navigate("/student/books", { replace: true });
      else navigate("/", { replace: true });
    } catch (error) {
      const message = error.response?.data?.message;
      if (message === "Invalid credentials") {
        setError("email", { type: "server" });
        setError("password", {
          type: "server",
          message: "Invalid email or password",
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "90vh",
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          {isMobile ? (
            // 📱 MOBILE VIEW
            <Box sx={{ width: "100%" }}>
              {/* --- IMAGE WITH ANIMATION --- */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  animation: `${fadeInUp} 0.8s ease-out`, // أنيميشن الصورة
                }}
              >
                <img
                  src={login}
                  alt="login"
                  style={{ width: "100%", maxWidth: "300px" }}
                />
              </Box>

              {/* --- FORM WITH ANIMATION (Delayed) --- */}
              <Box
                sx={{
                  px: 2,
                  mt: 4,
                  animation: `${fadeInUp} 0.8s ease-out 0.2s backwards`, // تأخير 0.2s
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 520,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="700"
                    mb={1}
                    color="#535353"
                  >
                    LOGIN
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Al-Rowad for Publishing & Distribution
                  </Typography>

                  <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
                    <TextField
                      fullWidth
                      variant="standard"
                      label="Email"
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ mb: 5 }}
                    />
                    <TextField
                      fullWidth
                      variant="standard"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      {...register("password")}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      sx={{ mb: 3 }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Remember username"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" sx={{ mb: 5 }}>
                      Forgotten your{" "}
                      <span style={{ color: "#2f6ad9" }}>username</span> or{" "}
                      <span style={{ color: "#2f6ad9" }}>password?</span>
                    </Typography>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{
                        backgroundColor: "#234a8b",
                        py: 1.8,
                        borderRadius: "6px",
                        fontWeight: "bold",
                        transition: "transform 0.2s",
                        "&:hover": { transform: "scale(1.02)" },
                      }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={22} sx={{ color: "white" }} />
                      ) : (
                        "CONTINUE"
                      )}
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2 }} align="center">
                      Already have an account?{" "}
                      <span
                        style={{ color: "#2f6ad9", cursor: "pointer" }}
                        onClick={() => navigate("/register")}
                      >
                        Sign Up here
                      </span>
                    </Typography>
                  </form>
                </Box>
              </Box>
            </Box>
          ) : (
            // 💻 DESKTOP VIEW
            <Grid
              container
              spacing={{ xs: 2, md: 6 }}
              sx={{ px: { xs: 2, md: 6 } }}
            >
              {/* ---------- LEFT SIDE (Image from Left) ---------- */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center", // 👈 بدل flex-start
                  px: { md: 4 },
                  animation: `${fadeInLeft} 1s ease-out`, // أنيميشن من اليسار
                }}
              >
                <Box sx={{ width: { xs: 300, md: 550 }, maxWidth: "100%" }}>
                  <img
                    src={login}
                    alt="login"
                    style={{ width: "100%", height: "auto" }}
                  />
                </Box>
              </Grid>

              {/* ---------- RIGHT SIDE (Form from Right) ---------- */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  pl: { md: 14 },
                  pr: { md: 6 },
                  animation: `${fadeInRight} 1s ease-out`, // أنيميشن من اليمين
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 520,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="700"
                    mb={1}
                    color="#535353"
                  >
                    LOGIN
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Al-Rowad for Publishing & Distribution
                  </Typography>

                  <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
                    <TextField
                      fullWidth
                      variant="standard"
                      label="Email"
                      type="email"
                      autoComplete="email"
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ mb: 5 }}
                    />
                    <TextField
                      fullWidth
                      variant="standard"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      autoComplete="current-password"
                      {...register("password")}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      sx={{ mb: 3 }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Remember username"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" sx={{ mb: 5 }}>
                      Forgotten your{" "}
                      <span style={{ color: "#2f6ad9" }}>username</span> or{" "}
                      <span style={{ color: "#2f6ad9" }}>password?</span>
                    </Typography>

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{
                        backgroundColor: "#234a8b",
                        py: 1.8,
                        borderRadius: "6px",
                        fontWeight: "bold",
                        boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                        transition: "transform 0.2s",
                        "&:hover": {
                          backgroundColor: "#1b3766",
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={22} sx={{ color: "white" }} />
                      ) : (
                        "CONTINUE"
                      )}
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2 }} align="center">
                      Already have an account?{" "}
                      <span
                        style={{ color: "#2f6ad9", cursor: "pointer" }}
                        onClick={() => navigate("/register")}
                      >
                        Sign Up here
                      </span>
                    </Typography>
                  </form>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* ================= FOOTER ================= */}
        <Box sx={{ textAlign: "center", pt: 3 }}>
          <Typography
            variant="body2"
            sx={{ color: "#555", fontWeight: 500, letterSpacing: 1 }}
          >
            alrowadpub.com
          </Typography>
        </Box>
      </Box>
    </>
  );
}
