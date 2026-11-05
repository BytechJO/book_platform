/* eslint-disable react-hooks/immutability, react-hooks/purity */
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, useWatch } from "react-hook-form";
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
  Alert,
  keyframes,
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

const LOGIN_RATE_LIMITS_KEY = "loginRateLimits";
const LEGACY_LOGIN_RATE_LIMIT_KEY = "loginRateLimitUntil";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const loadLoginRateLimits = () => {
  localStorage.removeItem(LEGACY_LOGIN_RATE_LIMIT_KEY);

  try {
    const storedLimits = JSON.parse(
      localStorage.getItem(LOGIN_RATE_LIMITS_KEY) || "{}",
    );
    const activeLimits = Object.fromEntries(
      Object.entries(storedLimits).filter(
        ([email, lockUntil]) =>
          email && Number(lockUntil) > Date.now(),
      ),
    );

    localStorage.setItem(LOGIN_RATE_LIMITS_KEY, JSON.stringify(activeLimits));
    return activeLimits;
  } catch {
    localStorage.removeItem(LOGIN_RATE_LIMITS_KEY);
    return {};
  }
};

const saveLoginRateLimits = (limits) => {
  if (Object.keys(limits).length === 0) {
    localStorage.removeItem(LOGIN_RATE_LIMITS_KEY);
    return;
  }

  localStorage.setItem(LOGIN_RATE_LIMITS_KEY, JSON.stringify(limits));
};

const getRemainingSeconds = (lockUntil) =>
  Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000));

const formatCountdown = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

// تعريف الأنيميشنز
const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const fadeInLeft = keyframes`
  0% { opacity: 0; transform: translateX(-50px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const fadeInRight = keyframes`
  0% { opacity: 0; transform: translateX(50px); }
  100% { opacity: 1; transform: translateX(0); }
`;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [rateLimits, setRateLimits] = useState(loadLoginRateLimits);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

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
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const currentEmail = normalizeEmail(
    useWatch({ control, name: "email", defaultValue: "" }),
  );
  const lockUntil = Number(rateLimits[currentEmail]) || 0;
  const isRateLimited = remainingSeconds > 0;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (role === "teacher") navigate("/teacher", { replace: true });
      else if (role === "student")
        navigate("/student", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getRemainingSeconds(lockUntil);
      setRemainingSeconds(remaining);

      if (remaining === 0 && lockUntil && currentEmail) {
        setRateLimits((currentLimits) => {
          const nextLimits = { ...currentLimits };
          delete nextLimits[currentEmail];
          saveLoginRateLimits(nextLimits);
          return nextLimits;
        });
      }
    };

    updateCountdown();
    if (!lockUntil) return undefined;

    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [currentEmail, lockUntil]);

  const onSubmit = async (data) => {
    if (isRateLimited) return;

    setLoginError("");

    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, data);
      const { token, user } = response.data;
      setRateLimits((currentLimits) => {
        const nextLimits = { ...currentLimits };
        delete nextLimits[normalizeEmail(data.email)];
        saveLoginRateLimits(nextLimits);
        return nextLimits;
      });
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;

      const pendingQrAction = sessionStorage.getItem("pendingQrAction");
      if (pendingQrAction) {
        navigate(pendingQrAction, { replace: true });
        return;
      }

      if (user.role === "admin")
        navigate("/admin/dashboard", { replace: true });
      else if (user.role === "teacher") navigate("/teacher", { replace: true });
      else if (user.role === "student")
        navigate("/student", { replace: true });
      else navigate("/", { replace: true });
    } catch (error) {
      const message = error.response?.data?.message;
      if (error.response?.status === 429) {
        const retryAfterSeconds = Number(
          error.response?.data?.retry_after_seconds ||
            error.response?.headers?.["retry-after"] ||
            15 * 60,
        );
        // The server response starts a real-time lock outside React rendering.
        const nextLockUntil = Date.now() + retryAfterSeconds * 1000;
        const limitedEmail = normalizeEmail(data.email);

        clearErrors();
        setRateLimits((currentLimits) => {
          const nextLimits = {
            ...currentLimits,
            [limitedEmail]: nextLockUntil,
          };
          saveLoginRateLimits(nextLimits);
          return nextLimits;
        });
        setRemainingSeconds(retryAfterSeconds);
        return;
      }

      if (
        error.response?.status === 403 &&
        message === "Account inactive or unavailable"
      ) {
        clearErrors();
        setLoginError(
          "Your account is inactive. Please contact the administrator.",
        );
        return;
      }

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
          minHeight: "100vh", // استخدام 100vh لملء الشاشة بالكامل
          backgroundColor: "#fff",
        }}
      >
        {/* استخدام Container لمنع التمدد الزائد على الشاشات الكبيرة جداً وحل مشكلة الفراغ الأبيض */}
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            py: { xs: 4, md: 0 },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid
              item
              xs={12}
              md={6} 
              sx={{
                display: "flex",
                justifyContent: "center",
                animation: {
                  xs: `${fadeInUp} 0.8s ease-out`,
                  md: `${fadeInLeft} 0.8s ease-out`,
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: { xs: 250, sm: 270, md: 350, lg: 550 },
                }}
              >
                <img
                  src={login}
                  alt="login"
                  style={{ width: "100%", height: "auto" }}
                />
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                animation: {
                  xs: `${fadeInUp} 0.8s ease-out 0.2s backwards`,
                  md: `${fadeInRight} 0.8s ease-out`,
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: { xs: 400, sm: 400, md: 450, lg: 500 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  px: { xs: 2, md: 0 }, 
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={3}
                  textAlign="center"
                >
                  Al-Rowad for Publishing & Distribution
                </Typography>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  autoComplete="on"
                  style={{ width: "100%" }}
                >
                  {isRateLimited && (
                    <Alert
                      severity="error"
                      sx={{ mb: 3, alignItems: "center" }}
                    >
                      <Typography variant="body2" fontWeight={700}>
                        Login temporarily locked
                      </Typography>
                      <Typography variant="body2">
                        Too many failed attempts. Try again in{" "}
                        <Box component="span" fontWeight={700}>
                          {formatCountdown(remainingSeconds)}
                        </Box>
                      </Typography>
                    </Alert>
                  )}
                  {loginError && !isRateLimited && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {loginError}
                    </Alert>
                  )}
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    {...register("email", {
                      onChange: () => setLoginError(""),
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 4 }}
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
                    disabled={isRateLimited}
                    sx={{ mb: 2 }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              disabled={isRateLimited}
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
                    control={
                      <Checkbox size="small" disabled={isRateLimited} />
                    }
                    label="Remember username"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" sx={{ mb: 4 }}>
                    Forgotten your{" "}
                    <span style={{ color: "#2f6ad9", cursor: "pointer" }}>
                      username
                    </span>{" "}
                    or{" "}
                    <span style={{ color: "#2f6ad9", cursor: "pointer" }}>
                      password?
                    </span>
                  </Typography>

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || isRateLimited}
                    sx={{
                      backgroundColor: "#234a8b",
                      py: 1.8,
                      borderRadius: "6px",
                      fontWeight: "bold",
                      boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                      transition: "transform 0.2s, background-color 0.2s",
                      "&:hover": {
                        backgroundColor: "#1b3766",
                        transform: "scale(1.02)",
                      },
                      "&:disabled": { backgroundColor: "#9AAAC2" },
                    }}
                  >
                    {isRateLimited ? (
                      `TRY AGAIN IN ${formatCountdown(remainingSeconds)}`
                    ) : isSubmitting ? (
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
        </Container>

        {/* ================= الفوتر ================= */}
        <Box sx={{ textAlign: "center", pb: 3 }}>
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
