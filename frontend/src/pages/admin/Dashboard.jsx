import { Box, Typography, Card, CardContent } from "@mui/material";
import dashboard from "../../assets/dashboard.svg";
import { useGetBooks } from "../../api/books";
import { useNavigate } from "react-router-dom";
import { useGetUsers } from "../../api/users";
import { useGetCodes } from "../../api";
import { Helmet } from "react-helmet-async";
import CurveLoader from "../../components/CurveLoader";

export default function Dashboard() {
  const { books = [], loading: booksLoading } = useGetBooks();
  const { users = [], loading: usersLoading } = useGetUsers();
  const { codes = [], loading: codesLoading } = useGetCodes();
  const navigate = useNavigate();

  if (booksLoading || usersLoading || codesLoading) {
    return <CurveLoader />;
  }

  const cards = [
    {
      title: "TOTAL USERS",
      value: users?.length || 0,
      path: "/admin/users",
    },
    {
      title: "TOTAL BOOKS",
      value: books?.length || 0,
      path: "/admin/books",
    },
    {
      title: "TOTAL CODES",
      value: codes?.length || 0,
      path: "/admin/codes",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Admin Panel</title>
      </Helmet>

      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 🔵 HEADER */}
        <Box
          sx={{
            backgroundColor: "#1A4D96",
            color: "white",
            textAlign: "center",
            pt: { xs: 1.5, sm: 2, md: 1 },
            // pb: { xs: 3, sm: 3.5, md: 1 },
            px: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 14, md: 16 },
              fontWeight: 400,
              opacity: 0.8,
            }}
          >
            Publisher Platform
          </Typography>

          <Typography
            sx={{
              mb: { xs: 2, md: 6 },
              fontSize: { xs: 26, md: 34 },
              fontWeight: 700,
            }}
          >
            Admin Dashboard
          </Typography>
        </Box>

        {/* 🟦 CONTENT */}
        <Box
          sx={{
            flex: 1,
            mt: { xs: -2.5, sm: -3, md: -4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, sm: 3, md: 6 },
            pb: 2,
          }}
        >
          {/* 📊 CARDS */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "1600px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: { xs: "16px", sm: "24px", md: "40px", lg: "60px" },
              mx: "auto",
            }}
          >
            {cards.map((item, index) => (
              <Card
                key={index}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 12px)",
                    md: "390px",
                  },
                  height: { xs: "180px", sm: "200px", md: "250px" },
                  borderRadius: { xs: "16px", sm: "20px", md: "25px" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)",
                  boxShadow: "0 25px 45px rgba(0,0,0,0.12)",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent
                  sx={{ textAlign: "center", p: { xs: 1.5, md: 2 } }}
                >
                  <Typography
                    sx={{
                      color: "#2F5DA0",
                      fontWeight: 500,
                      fontSize: { xs: "16px", sm: "18px", md: "22px" },
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1.5,
                      fontWeight: "bold",
                      color: "#2F5DA0",
                      fontSize: { xs: "36px", sm: "42px", md: "48px" },
                    }}
                  >
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* 🖼 IMAGE */}
          <Box textAlign="center" sx={{ mt: { xs: 2, md: 0 } }}>
            <img
              src={dashboard}
              alt="dashboard"
              style={{
                width: "60%",
                maxWidth: { xs: "200px", sm: "200px", md: "300px" },
              }}
            />
          </Box>

          {/* 🔹 FOOTER */}
          <Typography
            variant="body2"
            sx={{
              color: "#2A2A2A",
              mb: 1,
              fontSize: { xs: "12px", sm: "14px" },
            }}
          >
            alrowadpub.com
          </Typography>
        </Box>
      </Box>
    </>
  );
}
