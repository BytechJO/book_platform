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
import { useEffect, useState } from "react";
import Logo2 from "../../assets/logo2.svg";
import login from "../../assets/login.svg";
import axiosInstance from "../../api/axios";
import ENDPOINTS from "../../api/endpoints";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    if (role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }
}, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);

      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
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
              <Typography variant="h5" fontWeight="bold" mb={1}>
                LOGIN
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={5}>
                Al-Rowad for Publishing & Distribution
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  variant="standard"
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  sx={{ mb: 5 }}
                />

                <TextField
                  fullWidth
                  variant="standard"
                  type="password"
                  label="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
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
