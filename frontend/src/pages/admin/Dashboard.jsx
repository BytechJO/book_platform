import { Box, Typography, Card } from "@mui/material";
import { useGetBooks } from "../../api/books";
import { useNavigate } from "react-router-dom";
import { useGetUsers } from "../../api/users";
import { useGetCodes } from "../../api";
import { Helmet } from "react-helmet-async";
import CurveLoader from "../../components/CurveLoader";
import PersonIcon from "../../assets/icon/userIcone.svg";
import MenuBookIcon from "../../assets/icon/bookIcone.svg";
import CodeIcon from "../../assets/icon/codeIcone.svg";
import ArrowForwardIosIcon from "../../assets/icon/arrowIcone.svg";
import rectangle from "../../assets/icon/Rectangle.png";

export default function Dashboard() {
  const { books = [], loading: booksLoading } = useGetBooks();
  const { users = [], loading: usersLoading } = useGetUsers();
  const { codes = [], loading: codesLoading } = useGetCodes();
  const navigate = useNavigate();

  if (booksLoading || usersLoading || codesLoading) {
    return <CurveLoader />;
  }
  const getMonthlyGrowth = (data) => {
    const now = new Date();

    const currentMonth = now.getUTCMonth();
    const currentYear = now.getUTCFullYear();

    const lastMonthDate = new Date(Date.UTC(currentYear, currentMonth - 1));
    const lastMonth = lastMonthDate.getUTCMonth();
    const lastMonthYear = lastMonthDate.getUTCFullYear();

    const current = data.filter((item) => {
      const d = new Date(item.created_at);
      return (
        d.getUTCMonth() === currentMonth && d.getUTCFullYear() === currentYear
      );
    }).length;

    const previous = data.filter((item) => {
      const d = new Date(item.created_at);
      return (
        d.getUTCMonth() === lastMonth && d.getUTCFullYear() === lastMonthYear
      );
    }).length;

    if (previous === 0) {
      return current === 0 ? 0 : 100;
    }

    return Math.round(((current - previous) / previous) * 100);
  };
  const usersPercent = getMonthlyGrowth(users);
  const booksPercent = getMonthlyGrowth(books);
  const codesPercent = getMonthlyGrowth(codes);
  const cards = [
    {
      title: "TOTAL USERS",
      value: users.length,
      icon: <img src={PersonIcon} style={{ width: 50, height: 50 }} />,
      percent: `${usersPercent > 0 ? "+" : ""}${usersPercent}%`,
      color: usersPercent >= 0 ? "#4CAF50" : "#F44336",
      path: "/admin/users",
    },
    {
      title: "TOTAL BOOK",
      value: books.length,
      icon: <img src={MenuBookIcon} style={{ width: 50, height: 50 }} />,
      percent: `${booksPercent > 0 ? "+" : ""}${booksPercent}%`,
      color: booksPercent >= 0 ? "#4CAF50" : "#F44336",
      path: "/admin/books",
    },
    {
      title: "TOTAL CODE",
      value: codes.length,
      icon: <img src={CodeIcon} style={{ width: 50, height: 50 }} />,
      percent: `${codesPercent > 0 ? "+" : ""}${codesPercent}%`,
      color: codesPercent >= 0 ? "#4CAF50" : "#F44336",
      path: "/admin/codes",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Admin Panel</title>
      </Helmet>

      {/* الحاوية الرئيسية للصفحة كلها */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* 1. العنوان (أعلى الصفحة) */}
        <Box sx={{ textAlign: "center", mt: 6, mb: 10 }}>
          <Typography
            sx={{
              fontSize: 32,
              fontWeight: 700,
              color: "#2F5DA0",
            }}
          >
            Admin Dashboard
          </Typography>
        </Box>

        {/* 2. منطقة الكروت (النص) - تأخذ كل المساحة المتاحة وتدفع الفوتر للأسفل */}
        <Box
          sx={{
            flex: 1, // 🔥 السر هنا: يأخذ كل المساحة الفاضلة
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center", // 🔥 يوسط الكروت بشكل عمودي في هذه المساحة
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            {cards.map((item, index) => (
              <Card
                key={index}
                sx={{
                  width: { xs: "100%", sm: "350px" },
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  boxShadow: "0 5px 3px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => navigate(item.path)}
              >
                {/* هيدر الكرت */}
                <Box
                  sx={{
                    backgroundImage: `url(${rectangle})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    color: "white",
                    textAlign: "center",
                    py: 3,
                  }}
                >
                  <Typography sx={{ fontSize: 20 }}>{item.title}</Typography>
                  <Box mt={1}>{item.icon}</Box>
                </Box>

                {/* body الكرت */}
                <Box
                  sx={{
                    position: "relative",
                    backgroundColor: "#fff",
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* التدرج */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(41deg, rgba(255,255,255,0) 40%, rgba(210,210,210,0.6) 100%)`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* محتوى الكرت */}
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <Typography
                        sx={{
                          fontSize: 32,
                          fontWeight: "bold",
                          color: "#2F5DA0",
                        }}
                      >
                        {item.value}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: "#999", mt: 0.5 }}>
                        {item.title === "TOTAL USERS" && "users Published"}
                        {item.title === "TOTAL BOOK" && "Books Published"}
                        {item.title === "TOTAL CODE" && "Codes Generated"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ height: "1px", backgroundColor: "#eee", mx: 2 }}
                    />

                    {/* فوتر الكرت */}
                    <Box
                      sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        py: 1.5,
                      }}
                    >
                      {/* 🔥 CENTER */}
                      <Box
                        sx={{
                          position: "absolute",
                          left: "50%",
                          transform: "translateX(-50%)",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: item.color + "20",
                            color: item.color,
                            px: 1,
                            borderRadius: "12px",
                            fontSize: 13,
                          }}
                        >
                          {item.percent}
                        </Box>

                        <Typography sx={{ fontSize: 14, color: "#777" }}>
                          From last month
                        </Typography>
                      </Box>

                      {/* 🔥 RIGHT */}
                      <Box sx={{ marginLeft: "auto" }}>
                        <img src={ArrowForwardIosIcon} style={{ width: 40 }} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>

        {/* 3. الفوتر (آخر الصفحة تحت تحت) */}
        <Box sx={{ textAlign: "center", pb: 2, pt: 12 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#2A2A2A",
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
