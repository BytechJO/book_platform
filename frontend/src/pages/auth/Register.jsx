import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
} from "@mui/material";
import { useState } from "react";
import Logo2 from "../../assets/logo2.svg";
import register from "../../assets/register.svg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import ENDPOINTS from "../../api/endpoints";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { InputAdornment, IconButton } from "@mui/material";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, {
        full_name: form.fullName,
        email: form.email,
        password: form.password,
      });
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Registration failed");
    }
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      {/* ================= HEADER ================= */}
      <Container maxWidth="xl" sx={{ pt: 3, pb: 8 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-start", pl: 6 }}>
          <img src={Logo2} alt="logo" style={{ height: 70 }} />
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
                src={register}
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
                  mb: 6,
                }}
              >
                Create Account
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  variant="standard"
                  label="Full Name"
                  name="fullName"
                  value={form.fullName || ""}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  variant="standard"
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  variant="standard"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  variant="standard"
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                  InputProps={{
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
                  }}
                />

                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="I have received and agree to the Terms of Service and Privacy
                  Policy"
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
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
                  CONTINUE
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
          pb: 3,
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
  );
}
