import { Box, Container, Typography, Button } from "@mui/material";
import Logo from "../../assets/logo.svg";
import Student1 from "../../assets/student1.svg";
import Student2 from "../../assets/student2.svg";
import Student3 from "../../assets/student3.svg";
import Student4 from "../../assets/student4.svg";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
  return (
    <Box sx={{ backgroundColor: "#f5f6f8", minHeight: "100vh" }}>
        <Helmet>
            <title>Home - Publisher Platform</title>
            <meta name="description" content="Welcome to our Publisher Platform, where innovation meets education. Explore our smart, accessible learning solutions designed for every stage of learning." />
        </Helmet>

      <Container sx={{ textAlign: "center", py: 8 }}>
        {/* Logo */}
        <Box sx={{ mb: 3 }}>
          <img src={Logo} alt="Logo" style={{ height: 60 }} />
        </Box>

        {/* Title */}
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
          Innovative Learning <br />
          Solutions <span style={{ color: "#234a8b" }}>Online</span>
        </Typography>

        {/* Subtitle */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Smart, accessible educational content for <br />
          every stage of learning.
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#234a8b",
              px: 4,
              borderRadius: "30px",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2f6ad9",
              px: 4,
              borderRadius: "30px",
            }}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </Box>
      </Container>

      {/* Images Section */}
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          pb: 8,
          flexWrap: "wrap",
        }}
      >
        {[Student1, Student2, Student3, Student4].map((img, index) => (
          <Box
            key={index}
            sx={{
              width: 220,
              height: 320,
              borderRadius: "110px",
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <img
              src={img}
              alt="student"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        ))}
      </Container>
    </Box>
  );
}
