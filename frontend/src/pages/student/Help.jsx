import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";

export default function Help() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 20,
          p: 5,
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          textAlign: "center",
          fontFamily: "Poppins",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Help Center
        </Typography>

        <Typography sx={{ color: "#6b6b6b", mb: 4 }}>
          If you’re experiencing any issues or have questions about using the
          platform, feel free to contact our support team.
        </Typography>

        <Button
          variant="contained"
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
          Contact Support
        </Button>
      </Box>
    </Container>
  );
}
