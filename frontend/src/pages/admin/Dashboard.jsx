import { Box, Typography, Card, CardContent } from "@mui/material";
import dashboard from "../../assets/dashboard.svg";
import { useGetBooks } from "../../api/books";
import { useNavigate } from "react-router-dom";
import { useGetUsers } from "../../api/users";
import { useGetCodes } from "../../api";
import { Helmet } from "react-helmet-async";
import SiteLoader from "../../components/SiteLoade";

export default function Dashboard() {
  const { books = [], loading: booksLoading } = useGetBooks();
  const { users = [], loading: usersLoading } = useGetUsers();
  const { codes = [], loading: codesLoading } = useGetCodes();
  const navigate = useNavigate();
  if (booksLoading || usersLoading || codesLoading) {
    return <SiteLoader fullScreen text="Loading Dashboard..." />;
  }
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
          backgroundColor: "#ffffff",
        }}
      >
        {/* 🔵 HEADER */}
        <Box
          sx={{
            backgroundColor: "#1A4D96",
            color: "white",
            textAlign: "center",
            pt: 1,
            pb: 4,
          }}
        >
          <Typography
            sx={{ opacity: 0.85 }}
            mb={2}
            fontSize="30px"
            fontWeight="400"
          >
            Publisher Platform
          </Typography>

          <Typography
            variant="h4"
            mt={1}
            mb={4}
            fontSize="30px"
            fontWeight="600"
          >
            Admin Dashboard
          </Typography>
        </Box>

        {/* 🟦 CONTENT */}
        <Box
          sx={{
            flex: 1,
            mt: -4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            px: 6,
            pb: 2,
          }}
        >
          {/* 📊 CARDS */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "1600px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "60px",
              mx: "auto",
            }}
          >
            {[
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
            ].map((item, index) => (
              <Card
                key={index}
                sx={{
                  width: "390px",
                  height: "250px",
                  borderRadius: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)",
                  boxShadow: "0 25px 45px rgba(0,0,0,0.12)",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      color: "#6b8cc9",
                      fontWeight: 500,
                      fontSize: 22,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="h3"
                    sx={{
                      mt: 2,
                      fontWeight: "bold",
                      color: "#355ea8",
                    }}
                  >
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* 🖼 IMAGE */}
          <Box textAlign="center">
            <img
              src={dashboard}
              alt="dashboard"
              style={{
                width: "300px",
                maxWidth: "100%",
              }}
            />
          </Box>

          {/* 🔹 FOOTER */}
          <Typography variant="body2" sx={{ color: "#355ea8", mb: 1 }}>
            alrowadpub.com
          </Typography>
        </Box>
      </Box>
    </>
  );
}
