/* eslint-disable react-hooks/immutability */
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
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (role === "teacher") navigate("/teacher", { replace: true });
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
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;

      if (user.role === "admin")
        navigate("/admin/dashboard", { replace: true });
      else if (user.role === "teacher") navigate("/teacher", { replace: true });
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
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
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
                    sx={{ mb: 2 }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
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
                    disabled={isSubmitting}
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
                      "&:disabled": { backgroundColor: "#234a8b" },
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
