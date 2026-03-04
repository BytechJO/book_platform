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
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "teacher") {
        navigate("/teacher/books", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
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

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "teacher") {
        navigate("/teacher/books", { replace: true });
      } else if (user.role === "student") {
        navigate("/student/books", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      const message = error.response?.data?.message;

      if (message === "Invalid credentials") {
        setError("email", {
          type: "server",
        });

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
        <title>Login </title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        {/* ================= HEADER ================= */}
        <Container maxWidth="xl" sx={{ pt: 3, pb: 8 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-start", pl: 6 }}>
            <img
              src={Logo2}
              alt="logo"
              style={{ height: 70, cursor: "pointer" }}
              onClick={() => navigate(`/`)}
            />
          </Box>
        </Container>

        {/* ================= CONTENT ================= */}
        <Box sx={{ flex: 1 }}>
          <Grid
            container
            spacing={8}
            sx={{
              px: 6,
            }}
          >
            {/* ---------- LEFT SIDE (Images) ---------- */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: { xs: 6, md: 0 },
                pl: { md: 6 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 300, md: 550 },
                  maxWidth: "100%",
                }}
              >
                <img
                  src={login}
                  alt="login"
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </Box>
            </Grid>
            {/* ---------- RIGHT SIDE (Form) ---------- */}
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

                <Typography variant="body2" color="text.secondary" mb={5}>
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
                      "&:hover": {
                        backgroundColor: "#1b3766",
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
        </Box>

        {/* ================= FOOTER ================= */}
        <Box
          sx={{
            textAlign: "center",
            pt: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#555",
              fontWeight: 500,
              letterSpacing: 1,
            }}
          >
            alrowadpub.com
          </Typography>
        </Box>
      </Box>
    </>
  );
}
