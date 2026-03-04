import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: 120, fontWeight: 700, color: "#2B5A9E" }}
      >
        404
      </Typography>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Page Not Found
      </Typography>

      <Typography sx={{ mb: 4, color: "#7a869a" }}>
        The page you are looking for does not exist.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          backgroundColor: "#2B5A9E",
          textTransform: "none",
          px: 4,
        }}
      >
        Go Home
      </Button>
    </Box>
  );
}