import { useEffect, useState, useRef } from "react";
import { Box, Container, Typography, Button, keyframes } from "@mui/material"; // 1. استيراد keyframes
import Logo from "../../../assets/logo2.svg";
import Student1 from "../../../assets/student1.svg";
import Student2 from "../../../assets/student2.png";
import Student3 from "../../../assets/student3.svg";
import Student4 from "../../../assets/student4.png";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import BookSlider from "./BookSlider";

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const circles = [
  { size: 25, color: "#3b82f6" },
  { size: 25, color: "#facc15" },
  { size: 20, color: "#ec4899" },
  { size: 16, color: "#22c55e" },
  { size: 18, color: "#8b5cf6" },
  { size: 14, color: "#f59e0b" },
  { size: 15, color: "#00C3A5" },
  { size: 30, color: "#ff4d4f" },
  { size: 10, color: "#22c55e" },
  { size: 12, color: "#6366f1" },
];

export default function Home() {
  const imagesRef = useRef([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [dynamicCircles, setDynamicCircles] = useState(
    circles.map((c) => ({ ...c, opacity: 1, top: "50%", left: "50%" })), // قيم مبدئية
  );

  useEffect(() => {
    // حساب المواقع الأولى مرة واحدة عند التحميل
    const timer = setTimeout(() => {
      // eslint-disable-next-line react-hooks/immutability
      updateCirclesPosition();
    }, 100);

    const interval = setInterval(() => {
      updateCirclesPosition();
    }, 4000); // زيادة المدة لتكون أهدأ

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const updateCirclesPosition = () => {
    const newCircles = [];
    const imageRects = imagesRef.current.map((el) =>
      el?.getBoundingClientRect(),
    );

    const isInsideImage = (top, left) => {
      return imageRects.some((rect) => {
        if (!rect) return false;
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return false;
        const x = containerRect.left + (left / 100) * containerRect.width;
        const y = containerRect.top + (top / 100) * containerRect.height;
        return (
          x > rect.left && x < rect.right && y > rect.top && y < rect.bottom
        );
      });
    };

    const isMobile = window.innerWidth < 600;
    const zones = isMobile
      ? [
          { top: [0, 20], left: [0, 90] },
          { top: [5, 40], left: [15, 40] },
          { top: [5, 40], left: [60, 85] },
          { top: [5, 40], left: [35, 65] },
        ]
      : [
          { top: [10, 20], left: [30, 70] },
          { top: [70, 85], left: [30, 70] },
          { top: [30, 70], left: [10, 25] },
          { top: [30, 70], left: [75, 90] },
          { top: [45, 55], left: [35, 42] },
          { top: [45, 55], left: [48, 55] },
          { top: [45, 55], left: [60, 67] },
        ];

    const shuffledZones = zones.sort(() => Math.random() - 0.5);

    circles.forEach((circle, index) => {
      const zone = shuffledZones[index % shuffledZones.length];
      let newPos;
      let tries = 0;

      do {
        newPos = {
          top: Math.random() * (zone.top[1] - zone.top[0]) + zone.top[0],
          left: Math.random() * (zone.left[1] - zone.left[0]) + zone.left[0],
        };
        tries++;
      } while (isInsideImage(newPos.top, newPos.left) && tries < 20);

      newCircles.push({
        ...circle,
        top: newPos.top + "%",
        left: newPos.left + "%",
        opacity: 1,
      });
    });

    setDynamicCircles(newCircles);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Helmet>
          <title>Home - Publisher Platform</title>
          <meta
            name="description"
            content="Welcome to our Publisher Platform..."
          />
        </Helmet>

        <Container sx={{ textAlign: "center", py: 4 }}>
          {/* Title Animation */}
          <Typography
            variant="h3"
            fontWeight="bold"
            fontSize="36px"
            sx={{
              mb: 2,
              animation: `${fadeInUp} 0.8s ease-out 0.2s backwards`,
            }}
          >
            Innovative Learning <br />
            Solutions <span style={{ color: "#234a8b" }}>Online</span>
          </Typography>

          {/* Subtitle Animation */}
          <Typography
            variant="body1"
            fontSize="17.5px"
            color="#504D4E"
            fontWeight={400}
            sx={{
              mb: 2,
              animation: `${fadeInUp} 0.8s ease-out 0.4s backwards`,
            }}
          >
            Smart, accessible educational content for <br />
            every stage of learning.
          </Typography>

          {/* Buttons Animation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              animation: `${fadeInUp} 0.8s ease-out 0.6s backwards`,
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#234a8b",
                px: 4,
                borderRadius: "30px",
                width: "140px",
                "&:hover": { backgroundColor: "#1b3766" },
              }}
              onClick={() => {
                const token = localStorage.getItem("token");
                const role = localStorage.getItem("role");
                if (token) {
                  if (role === "admin") navigate("/admin/dashboard");
                  else if (role === "teacher") navigate("/teacher/books");
                  else if (role === "student") navigate("/student/books");
                  else navigate("/");
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
                width: "140px",
                px: 4,
                borderRadius: "30px",
                "&:hover": { backgroundColor: "#2557c7" },
              }}
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
          </Box>
        </Container>

        {/* Images Section */}
        <Box
          ref={containerRef}
          sx={{
            position: "relative",
            height: {
              xs: "180px",
              sm: "250px",
              md: "400px",
            },
            mt: 4,
          }}
        >
          {/* Circles with Smooth Movement */}
          {dynamicCircles.map((circle, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                width: circle.size,
                height: circle.size,
                borderRadius: "50%",
                backgroundColor: circle.color,
                top: circle.top,
                left: circle.left,
                opacity: circle.opacity,
                transition:
                  "top 2s ease-in-out, left 2s ease-in-out, opacity 1s ease",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            />
          ))}

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
                ref={(el) => (imagesRef.current[index] = el)}
                sx={{
                  width: { xs: 70, sm: 120, md: 220 },
                  height: { xs: 100, sm: 180, md: 320 },
                  borderRadius: "110px",
                  overflow: "hidden",
                  boxShadow: 3,
                  transform:
                    index === 0 || index === 3
                      ? { xs: "translateY(-30px)", md: "translateY(-80px)" }
                      : { xs: "translateY(10px)", md: "translateY(30px)" },
                  animation: `${scaleIn} 0.6s ease-out ${0.8 + index * 0.15}s backwards`,
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
      </Box>

      {/* Categories Section Animation */}
      <Box
        sx={{
          mt: {
            xs: 1,
            sm: 4,
            md: 8,
          },
          backgroundColor: "#eef2f7",
          animation: `${fadeInUp} 1s ease-out 1.5s backwards`,
        }}
      >
        <Container maxWidth="lg" sx={{ pt: 5 }}>
          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            Our Educational <span style={{ color: "#234a8b" }}>Categories</span>
          </Typography>

          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
            fontWeight="400"
          >
            Building a world where learning meets innovation, a platform that
            empowers every mind to grow.
          </Typography>
        </Container>
        <BookSlider />
      </Box>
    </>
  );
}
