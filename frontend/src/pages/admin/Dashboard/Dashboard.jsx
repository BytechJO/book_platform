import { Box, Typography, Card } from "@mui/material";
import { useGetBooks } from "../../../api/books";
import { useNavigate } from "react-router-dom";
import { useGetUsers } from "../../../api/users";
import { useGetCodes } from "../../../api";
import { Helmet } from "react-helmet-async";
import CurveLoader from "../../../components/CurveLoader";
import PersonIcon from "../../../assets/icon/userIcone.svg";
import MenuBookIcon from "../../../assets/icon/bookIcone.svg";
import CodeIcon from "../../../assets/icon/codeIcone.svg";
import ArrowForwardIosIcon from "../../../assets/icon/arrowIcone.svg";
import rectangle from "../../../assets/icon/Rectangle.png";
import UsersGrowthChart from "./UsersGrowthChart";
import BooksChart from "./BooksChart";
import RecentActivity from "./RecentActivity";
import TopBooks from "./TopBooks";
import TopCodes from "./TopCodes";
import QuickActions from "./QuickActions";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CodesDialogs from "../CodesDialogs";

export default function Dashboard() {
  const [openDialog, setOpenDialog] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState([]);

  const [importPreviewOpen, setImportPreviewOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importedCodes, setImportedCodes] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [newValidity, setNewValidity] = useState("");

  const { books = [], loading: booksLoading } = useGetBooks();
  const { users = [], loading: usersLoading } = useGetUsers();
  const { codes = [], loading: codesLoading } = useGetCodes();
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 28)),
  );
  const [endDate, setEndDate] = useState(new Date());
  const navigate = useNavigate();
  const getRealEndDate = (start) => {
    if (!start) return null;

    const end = new Date(start);
    end.setDate(end.getDate() + 28);

    return end;
  };

  const getEndRange = (start) => {
    if (!start) return { min: null, max: null };

    const realEnd = getRealEndDate(start);

    const min = new Date(realEnd);
    min.setDate(min.getDate() - 5);

    const max = new Date(realEnd);
    max.setDate(max.getDate() + 5);

    return { min, max };
  };
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
      icon: <img src={PersonIcon} style={{ width: 28, height: 28 }} />,
      percent: `${usersPercent > 0 ? "+" : ""}${usersPercent}%`,
      color: usersPercent >= 0 ? "#4CAF50" : "#F44336",
      path: "/admin/users",
    },
    {
      title: "TOTAL BOOK",
      value: books.length,
      icon: <img src={MenuBookIcon} style={{ width: 28, height: 28 }} />,
      percent: `${booksPercent > 0 ? "+" : ""}${booksPercent}%`,
      color: booksPercent >= 0 ? "#4CAF50" : "#F44336",
      path: "/admin/books",
    },
    {
      title: "TOTAL CODE",
      value: codes.length,
      icon: <img src={CodeIcon} style={{ width: 28, height: 28 }} />,
      percent: `${codesPercent > 0 ? "+" : ""}${codesPercent}%`,
      color: codesPercent >= 0 ? "#4CAF50" : "#F44336",
      path: "/admin/codes",
    },
  ];
  const { min, max } = getEndRange(startDate);
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

          width: "95%",
          mx: "auto",

        }}
      >
        {/* 1. العنوان (أعلى الصفحة) */}
        <Box
          sx={{
            px: 3,
            pt: 3,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* العنوان */}
          <Typography
            sx={{
              fontSize: 26,
              fontWeight: 700,
              color: "#1F4E8C",
            }}
          >
            Admin Dashboard
          </Typography>

          {/* الفلاتر */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="Start"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setEndDate(null);
                }}
              />

              <DatePicker
                label="End"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                minDate={min}
                maxDate={max}
                disabled={!startDate}
              />
            </Box>
          </LocalizationProvider>
        </Box>
        {/* 2. منطقة الكروت (النص) - تأخذ كل المساحة المتاحة وتدفع الفوتر للأسفل */}
        <Box
          sx={{
            px: 3,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {cards.map((item, index) => (
            <Card
              key={index}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {item.icon}
                  <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                </Box>
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
                        fontSize: 24,
                        fontWeight: "bold",
                        color: "#2F5DA0",
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography sx={{ fontSize: 10, color: "#999", mt: 0.5 }}>
                      {item.title === "TOTAL USERS" && "users Published"}
                      {item.title === "TOTAL BOOK" && "Books Published"}
                      {item.title === "TOTAL CODE" && "Codes Generated"}
                    </Typography>
                  </Box>

                  <Box sx={{ height: "1px", backgroundColor: "#eee", mx: 2 }} />

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
                          fontSize: 11,
                          px: 1.2,
                          py: 0.2,
                          borderRadius: "6px",
                          fontWeight: 600,
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

        <Box
          sx={{
            px: 3,
            mt: 3,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          <UsersGrowthChart startDate={startDate} />
          <BooksChart startDate={startDate} />
          <RecentActivity />
        </Box>
        <Box
          sx={{
            px: 3,
            mt: 3,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          <TopBooks />
          <TopCodes codes={codes} />
          <QuickActions onGenerateClick={() => setOpenDialog(true)} />
        </Box>
        {/* Footer */}
        <Box
          sx={{
            mt: "auto",
            py: 2,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 12 }}>alrowadpub.com </Typography>
        </Box>
      </Box>
      <CodesDialogs
        books={books}
        refetch={() => {}}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        generateLoading={generateLoading}
        setGenerateLoading={setGenerateLoading}
        generatedCodes={generatedCodes}
        setGeneratedCodes={setGeneratedCodes}
        importPreviewOpen={importPreviewOpen}
        setImportPreviewOpen={setImportPreviewOpen}
        importLoading={importLoading}
        setImportLoading={setImportLoading}
        importedCodes={importedCodes}
        setImportedCodes={setImportedCodes}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        newValidity={newValidity}
        setNewValidity={setNewValidity}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
      />
    </>
  );
}
