import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function StudentHome() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 18,
          p: 5,
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          fontFamily: "Poppins",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Welcome Back 👋
        </Typography>

        <Typography sx={{ color: "#6b6b6b", mb: 4 }}>
          Manage your books, track your content, and explore the platform
          easily from here.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/student/books")}
          sx={{
            backgroundColor: "#2f4f8f",
            borderRadius: "20px",
            px: 4,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#243c6e",
            },
          }}
        >
          Go to Books
        </Button>
      </Box>
    </Container>
  );
}