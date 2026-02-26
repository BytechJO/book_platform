import { Box, Typography, Card, CardContent } from "@mui/material";
import dashboard from "../../assets/dashboard.svg";
import { useGetBooks } from "../../api/books";
import { useNavigate } from "react-router-dom";
import { useGetUsers } from "../../api/users";
import { useGetCodes } from "../../api";
export default function Dashboard() {
  const { books } = useGetBooks();
  const { users } = useGetUsers();
  const { codes } = useGetCodes();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "100vh", 
        overflow: "hidden",   
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#eef1f5",
      }}
    >
      {/* 🔵 HEADER */}
      <Box
        sx={{
          backgroundColor: "#1A4D96",
          color: "white",
          textAlign: "center",
          pt: 4,
          pb: 10, 
        }}
      >
        <Typography sx={{ opacity: 0.85 }}>Publisher Platform</Typography>

        <Typography variant="h4" fontWeight="bold" mt={1}>
          Admin Dashboard
        </Typography>
      </Box>

      {/* 🟦 CARDS + CONTENT */}
      <Box
        sx={{
          flex: 1, 
          mt: -8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          px: 4,
          pb: 2,
        }}
      >
        {/* CARDS */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "1600px",
            display: "flex",
            gap: 8,
          }}
        >
          {[
            { title: "TOTAL USERS", value: users?.length || 0, path: "/admin/users" },
            {
              title: "TOTAL BOOKS",
              value: books?.length || 0,
              path: "/admin/books",
            },
            { title: "TOTAL CODES", value: codes?.length || 0, path: "/admin/codes" },
          ].map((item, index) => (
            <Card
              key={index}
              sx={{
                flex: 1,
                height: 280,
                borderRadius: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-6px)",
                  transition: "0.2s",
                },
                background: "linear-gradient(to bottom, #f8f9fb, #e4e9f2)",
                boxShadow: "0 25px 45px rgba(0,0,0,0.12)",
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "#6b8cc9",
                    fontWeight: 500,
                    fontSize: 24,
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

        {/* IMAGE */}
        <Box textAlign="center">
          <img
            src={dashboard}
            alt="dashboard"
            style={{ width: "320px", maxWidth: "90%" }}
          />
        </Box>

        {/* FOOTER */}
        <Typography variant="body2" sx={{ color: "#355ea8", mb: 1 }}>
          alrowadpub.com
        </Typography>
      </Box>
    </Box>
  );
}
