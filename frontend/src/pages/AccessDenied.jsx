import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import accessDeniedImg from "../assets/access_denied.png";

export default function AccessDenied() {
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
      <Box
        component="img"
        src={accessDeniedImg}
        alt="Access Denied"
        sx={{
          width: 420,
          maxWidth: "100%",
          mb: 4,
        }}
      />

      <Typography
        variant="h4"
        sx={{ fontWeight: 600, color: "#d32f2f", mb: 1 }}
      >
        Access Denied
      </Typography>

      <Typography sx={{ color: "#7a869a", mb: 3 }}>
        You don’t have permission to access this page.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          backgroundColor: "#2B5A9E",
          textTransform: "none",
          px: 4,
          borderRadius: "8px",
        }}
      >
        Go Home
      </Button>
    </Box>
  );
}
