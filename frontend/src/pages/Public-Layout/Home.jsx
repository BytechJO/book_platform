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
    <Box
      sx={{
        backgroundColor: "#f5f6f8",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {" "}
      <Helmet>
        <title>Home - Publisher Platform</title>
        <meta
          name="description"
          content="Welcome to our Publisher Platform, where innovation meets education. Explore our smart, accessible learning solutions designed for every stage of learning."
        />
      </Helmet>
      {/* Decorative Circles */}
      <Box
        sx={{
          position: "absolute",
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: "#ff4d4f",
          top: "65%",
          right: "8%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#facc15",
          top: "70%",
          left: "15%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "#22c55e",
          top: "55%",
          right: "30%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: "#6366f1",
          bottom: "20%",
          left: "40%",
        }}
      />
      <Container sx={{ textAlign: "center", py: 8 }}>
        {/* Logo */}
        <Box sx={{ mb: 3 }}>
          <img src={Logo} alt="Logo" style={{ height: 40 }} />
        </Box>

        {/* Title */}
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            mb: 2,
            fontSize: {
              xs: "28px", // موبايل
              sm: "34px",
              md: "40px", // ديسكتوب
            },
          }}
        >
          Innovative Learning <br />
          Solutions <span style={{ color: "#234a8b" }}>Online</span>
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
            fontSize: {
              xs: "14px",
              sm: "16px",
            },
          }}
        >
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
          alignItems: "flex-end",
          gap: { xs: 1.5, sm: 3, md: 4 },
          pb: 8,
          flexWrap: "nowrap", // مهم عشان يضلهم جنب بعض
        }}
      >
        {[Student1, Student2, Student3, Student4].map((img, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: 70, sm: 120, md: 220 },
              height: { xs: 100, sm: 180, md: 320 },
              borderRadius: "110px",
              overflow: "hidden",
              boxShadow: 3,
              transform:
                index === 0 || index === 3
                  ? "translateY(0px)"
                  : {
                      xs: "translateY(15px)",
                      md: "translateY(50px)",
                    },
            }}
            gap={2}
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
