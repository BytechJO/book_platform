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
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import Logo2 from "../../assets/logo2.svg";
import register1 from "../../assets/register.svg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import ENDPOINTS from "../../api/endpoints";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { InputAdornment, IconButton } from "@mui/material";
import { Helmet } from "react-helmet-async";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const schema = yup.object().shape({
    fullName: yup
      .string()
      .trim()
      .required("Full name is required")
      .min(3, "Full name must be at least 3 characters"),

    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email format"),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password")], "Passwords must match"),

    code: yup.string().required("Activation code is required"),

    terms: yup
      .boolean()
      .oneOf([true], "You must accept the terms and privacy policy"),
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, {
        full_name: data.fullName,
        email: data.email,
        password: data.password,
        code: data.code,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      // eslint-disable-next-line react-hooks/immutability
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "teacher") {
        navigate("/teacher", { replace: true });
      } else if (user.role === "student") {
        navigate("/student", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      const message = error.response?.data?.message;

      if (message === "Email already exists") {
        setError("email", {
          type: "server",
          message: "Email already exists",
        });
      } else if (
        message === "Invalid code" ||
        message === "Code already used"
      ) {
        setError("code", {
          type: "server",
          message,
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        {/* ================= HEADER ================= */}
        <Container maxWidth="xl" sx={{ pt: 2, pb: 3 }}>
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
            spacing={3}
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
                py: { xs: 3, md: 0 },
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
                  src={register1}
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
                  justifyContent: "flex-start",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "34px",
                    lineHeight: "35px",
                    letterSpacing: "0.08em", // 8%
                    color: "#535353",
                    mb: 3,
                  }}
                >
                  Create Account
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Full Name"
                    {...register("fullName")}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    variant="standard"
                    type={showPassword ? "text" : "password"}
                    label="Password"
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
                  <TextField
                    fullWidth
                    variant="standard"
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm Password"
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    sx={{ mb: 2 }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
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
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Activation Code"
                    name="code"
                    {...register("code")}
                    error={!!errors.code}
                    helperText={errors.code?.message}
                    sx={{ mb: 2 }}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" {...register("terms")} />}
                    label="I have received and agree to the Terms of Service and Privacy Policy"
                    sx={{ mb: 1 }}
                  />

                  {errors.terms && (
                    <Typography color="error" variant="caption">
                      {errors.terms.message}
                    </Typography>
                  )}
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
                  <Typography variant="body2" sx={{ mt: 3 }} align="center">
                    Already have an account?{" "}
                    <span
                      style={{ color: "#2f6ad9", cursor: "pointer" }}
                      onClick={() => navigate("/login")}
                    >
                      Login here
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
