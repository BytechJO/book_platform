import { Box, Container, Typography, Button } from "@mui/material";
import Logo from "../../../assets/logo.svg";
import Student1 from "../../../assets/student1.svg";
import Student2 from "../../../assets/student2.svg";
import Student3 from "../../../assets/student3.svg";
import Student4 from "../../../assets/student4.svg";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import BookSlider from "./BookSlider";
const circles = [
  { size: 25, color: "#3b82f6", top: "25%", left: "16%" },
  { size: 25, color: "#facc15", bottom: "20%", left: "30%" },
  { size: 20, color: "#ec4899", top: "55%", left: "13%" },
  { size: 16, color: "#22c55e", top: "45%", right: "20%" },
  { size: 18, color: "#8b5cf6", bottom: "20%", right: "30%" },
  { size: 14, color: "#f59e0b", bottom: "10%", left: "45%" },
  { size: 15, color: "#00C3A5", top: "40%", right: "35%" },
];
export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#fff",
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
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: "#ff4d4f",
            top: "65%",
            right: "12%",
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
        {circles.map((circle, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              width: circle.size,
              height: circle.size,
              borderRadius: "50%",
              backgroundColor: circle.color,
              ...circle,
            }}
          />
        ))}
        <Container sx={{ textAlign: "center", py: 2 }}>
          {/* Logo */}
          <Box sx={{ mb: 3 }}>
            <img src={Logo} alt="Logo" style={{ height: 40 }} />
          </Box>

          {/* Title */}
          <Typography
            variant="h3"
            fontWeight="bold"
            fontSize="36px"
            fontFamily="Poppins"
            sx={{
              mb: 2,
            }}
          >
            Innovative Learning <br />
            Solutions <span style={{ color: "#234a8b" }}>Online</span>
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            fontSize="18px"
            color="#504D4E"
            fontWeight={400}
            fontFamily="Poppins"
            sx={{
              mb: 2,
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
              onClick={() => {
                const token = localStorage.getItem("token");
                const role = localStorage.getItem("role");

                if (token) {
                  if (role === "admin") {
                    navigate("/admin/dashboard");
                  } else if (role === "teacher") {
                    navigate("/teacher/books");
                  } else if (role === "student") {
                    navigate("/student/books");
                  } else {
                    navigate("/");
                  }
                } else {
                  navigate("/login");
                }
              }}
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
            pb: 2,
            flexWrap: "nowrap",
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
                    ? {
                        xs: "translateY(-30px)",
                        md: "translateY(-80px)",
                      }
                    : {
                        xs: "translateY(10px)",
                        md: "translateY(30px)",
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
      {/* Categories Section */}
      <Box sx={{ mt: 8 }}>
        <Container maxWidth="lg">
          {/* Title */}
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            Our Educational <span style={{ color: "#F15A29" }}>Categories</span>
          </Typography>

          {/* Subtitle */}
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
            fontWeight="400"
          >
            Building a world where learning meets innovation, a platform that
            empowers every mind to grow.
          </Typography>

          {/* Optional Filter Row */}
        </Container>

        <BookSlider />
      </Box>
    </>
  );
}
