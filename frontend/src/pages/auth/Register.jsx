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
import { useState } from "react";
import register1 from "../../assets/register.svg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import ENDPOINTS from "../../api/endpoints";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Helmet } from "react-helmet-async";

// ─── الأنيميشنز ───
const slideInLeft = keyframes`
  0% { opacity: 0; transform: translateX(-80px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  0% { opacity: 0; transform: translateX(80px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(25px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

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
  } = useForm({ resolver: yupResolver(schema) });

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
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;

      if (user.role === "admin")
        navigate("/admin/dashboard", { replace: true });
      else if (user.role === "teacher") navigate("/teacher", { replace: true });
      else if (user.role === "student") navigate("/student/books", { replace: true });
      else navigate("/", { replace: true });
    } catch (error) {
      const message = error.response?.data?.message;
      if (message === "Email already exists") {
        setError("email", { type: "server", message: "Email already exists" });
      } else if (
        message === "Invalid code" ||
        message === "Code already used"
      ) {
        setError("code", { type: "server", message });
      }
    }
  };

  const fieldDelay = (index) => `${0.6 + index * 0.1}s`;

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // ملء الشاشة بالكامل
          backgroundColor: "#fff",
        }}
      >
        {/* استخدام Container لمنع التصميم من الاتساع وتحل مشكلة الفراغات البيضاء */}
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
            {/* ---------- الجانب الأيسر (الصورة) ---------- */}
            <Grid
              item
              xs={12} // عامودي للموبايل
              md={6} // جنب بعض للويب والآيباد
              sx={{
                display: "flex",
                justifyContent: "center",
                opacity: 0,
                // أنيميشن يتغير حسب الشاشة
                animation: {
                  xs: `${fadeInUp} 0.8s ease-out 0.2s forwards`,
                  md: `${slideInLeft} 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards`,
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  // أحجام ديناميكية لكل الشاشات بدون تشوه
                  maxWidth: { xs: 250, sm: 270, md: 370, lg: 550 },
                }}
              >
                <img
                  src={register1}
                  alt="register"
                  style={{ width: "100%", height: "auto" }}
                />
              </Box>
            </Grid>

            {/* ---------- الجانب الأيمن (الفورم) ---------- */}
            <Grid
              item
              xs={12} // عامودي للموبايل
              md={6} // جنب بعض للويب والآيباد
              sx={{
                display: "flex",
                justifyContent: "center",
                opacity: 0,
                // أنيميشن يتغير حسب الشاشة
                animation: {
                  xs: `${fadeInUp} 0.8s ease-out 0.3s forwards`,
                  md: `${slideInRight} 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards`,
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: { xs: 400, sm: 420, md: 450, lg: 550 },
                  display: "flex",
                  flexDirection: "column",
                  px: { xs: 2, md: 0 }, // بادنج للموبايل فقط
                }}
              >
                {/* العنوان */}
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: { xs: "28px", md: "34px" },
                    lineHeight: "35px",
                    letterSpacing: "0.08em",
                    color: "#535353",
                    mb: 3,
                    opacity: 0,
                    animation: `${fadeInUp} 0.7s ease-out ${fieldDelay(0)} forwards`,
                  }}
                >
                  Create Account
                </Typography>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ width: "100%" }}
                >
                  {/* Full Name */}
                  <Box
                    sx={{
                      opacity: 0,
                      animation: `${fadeInUp} 0.6s ease-out ${fieldDelay(1)} forwards`,
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="standard"
                      label="Full Name"
                      {...register("fullName")}
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  {/* Email */}
                  <Box
                    sx={{
                      opacity: 0,
                      animation: `${fadeInUp} 0.6s ease-out ${fieldDelay(2)} forwards`,
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="standard"
                      label="Email"
                      type="email"
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  {/* Password */}
                  <Box
                    sx={{
                      opacity: 0,
                      animation: `${fadeInUp} 0.6s ease-out ${fieldDelay(3)} forwards`,
                    }}
                  >
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
                  </Box>

                  {/* Confirm Password */}
                  <Box
                    sx={{
                      opacity: 0,
                      animation: `${fadeInUp} 0.6s ease-out ${fieldDelay(4)} forwards`,
                    }}
                  >
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
                  </Box>

                  {/* Activation Code */}
                  <Box
                    sx={{
                      opacity: 0,
                      animation: `${fadeInUp} 0.6s ease-out ${fieldDelay(5)} forwards`,
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="standard"
                      label="Activation Code"
                      {...register("code")}
                      error={!!errors.code}
                      helperText={errors.code?.message}
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  {/* Terms Checkbox */}
                  <Box
                    sx={{
                      opacity: 0,
                      animation: `${fadeInUp} 0.6s ease-out ${fieldDelay(6)} forwards`,
                    }}
                  >
                    <FormControlLabel
                      control={<Checkbox size="small" {...register("terms")} />}
                      label="I have received and agree to the Terms of Service and Privacy Policy"
                      sx={{ mb: 1 }}
                    />
                    {errors.terms && (
                      <Typography
                        color="error"
                        variant="caption"
                        display="block"
                        sx={{ mb: 1 }}
                      >
                        {errors.terms.message}
                      </Typography>
                    )}
                  </Box>

                  {/* Submit Button */}
                  <Box
                    sx={{
                      opacity: 0,
                      animation: `${fadeInUp} 0.6s ease-out ${fieldDelay(7)} forwards`,
                    }}
                  >
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
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#1b3766",
                          transform: "translateY(-2px)",
                          boxShadow: "0px 12px 28px rgba(35, 74, 139, 0.35)",
                        },
                        "&:active": { transform: "translateY(0)" },
                        "&:disabled": {
                          opacity: 0.7,
                          backgroundColor: "#234a8b",
                        },
                      }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={22} sx={{ color: "white" }} />
                      ) : (
                        "CONTINUE"
                      )}
                    </Button>
                  </Box>

                  {/* Login Link */}
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      py: 2,
                      opacity: 0,
                      animation: `${fadeIn} 0.6s ease-out ${fieldDelay(8)} forwards`,
                    }}
                  >
                    Already have an account?{" "}
                    <span
                      style={{
                        color: "#2f6ad9",
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#1b3766")}
                      onMouseLeave={(e) => (e.target.style.color = "#2f6ad9")}
                      onClick={() => navigate("/login")}
                    >
                      Login here
                    </span>
                  </Typography>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            textAlign: "center",
            py: 2,
            opacity: 0,
            animation: `${fadeIn} 0.8s ease-out 1.8s forwards`,
          }}
        >
          <Typography sx={{ color: "#999", fontSize: "14px" }}>
            alrowadpub.com
          </Typography>
        </Box>
      </Box>
    </>
  );
}
