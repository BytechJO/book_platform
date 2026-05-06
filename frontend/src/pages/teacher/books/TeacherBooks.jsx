import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Pagination,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WelcomeBanner from "../WelcomeBanner";
import { useGetMyBooks } from "../../../api/user_books";
import { useNavigate } from "react-router-dom";
import CurveLoader from "../../../components/CurveLoader";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useGetTeacherClasses } from "../../../api/Classes";
export default function TeacherBooks() {
  const { books, loading } = useGetMyBooks();
  const navigate = useNavigate();
  const isArabic = (text) => /[\u0600-\u06FF]/.test(text || "");
  const { classes } = useGetTeacherClasses();

  const [sortBy, setSortBy] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);

  const booksPerPage = 4;
  const getStudentsCount = (bookId) => {
    if (!classes) return 0;

    return classes
      .filter((cls) => cls.book_id === bookId)
      .reduce((total, cls) => {
        return total + Number(cls.total_students || 0);
      }, 0);
  };
  // 🔹 Filter + Sort
  const sortedBooks = useMemo(() => {
    if (!books) return [];

    let result = [...books];

    // 🔎 Search
    if (searchTerm.trim() !== "") {
      const normalizedSearch = searchTerm.toLowerCase();
      result = result.filter((book) =>
        book.title?.toLowerCase().includes(normalizedSearch),
      );
    }

    // ✅ Status filter
    if (status !== "all") {
      result = result.filter((book) =>
        status === "active" ? book.is_active : !book.is_active,
      );
    }

    // 🔄 Sorting
    switch (sortBy) {
      case "latest":
        return result.sort(
          (a, b) => new Date(b.enrolled_at) - new Date(a.enrolled_at),
        );

      case "oldest":
        return result.sort(
          (a, b) => new Date(a.enrolled_at) - new Date(b.enrolled_at),
        );

      case "az":
        return result.sort((a, b) =>
          a.title.localeCompare(b.title, ["ar", "en"], {
            sensitivity: "base",
            numeric: true,
          }),
        );

      case "za":
        return result.sort((a, b) =>
          b.title.localeCompare(a.title, ["ar", "en"], {
            sensitivity: "base",
            numeric: true,
          }),
        );

      default:
        return result;
    }
  }, [books, searchTerm, sortBy, status]);

  // 🔹 Reset to page 1 when search/sort changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [searchTerm, sortBy, status]);

  // 🔹 Pagination Logic
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  const paginatedBooks = useMemo(() => {
    const startIndex = (page - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return sortedBooks.slice(startIndex, endIndex);
  }, [sortedBooks, page]);
  if (loading) {
    return <CurveLoader />;
  }
  return (
    <Box>
      <Helmet>
        <title>Teacher Books - Teacher Dashboard</title>
      </Helmet>

      {/* 🔹 Filters Section */}
      <Box
        sx={{
          width: "90%",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          mt: 0.5,
        }}
      >
        <WelcomeBanner variant="books" />{" "}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              md: "2fr 1fr 1fr",
            },
            gap: 2,
            alignItems: "end",
          }}
        >
          {/* Search */}
          <Box
            sx={{
              gridColumn: { xs: "1 / -1", md: "auto" },
            }}
          >
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Search:
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Sort */}
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Sort by:
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="latest">Latest</MenuItem>
                <MenuItem value="oldest">Oldest</MenuItem>
                <MenuItem value="az">Title (A-Z)</MenuItem>
                <MenuItem value="za">Title (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Status */}
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Status:
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
      {/* 🔹 Books Grid */}
      <Box
        sx={{
          width: "91%",
          mx: "auto",
          px: 4,
          pb: 1,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: {
              xs: 3,
              sm: 4,
              md: 3,
            },
          }}
          mt={3}
        >
          {paginatedBooks.length > 0 ? (
            paginatedBooks.map((book, id) => {
              const isRTL = isArabic(book.title || book.description);
              return (
                <Card
                  key={id}
                  onClick={() => navigate(`/teacher/books/${book.id}`)}
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #E6EAF0",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "0.2s ease",
                    overflow: "hidden",

                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                    }}
                  >
                    <CardContent sx={{ p: "0 !important" }}>
                      {/* 🔹 الصف الأول */}
                      <Box display="flex" gap={2} alignItems="center">
                        {/* 🔹 الصورة (ثابتة دايمًا عاليسار) */}
                        <Box
                          component="img"
                          src={book.cover_image_url_short}
                          alt={book.title}
                          sx={{
                            width: 120,
                            height: 170,
                            objectFit: "cover", // 🔥 أهم سطر
                            borderRadius: 2,
                            mt: 2,
                            ml: 1,
                          }}
                        />

                        {/* 🔹 النص */}
                        <Box flex={1}>
                          {/* 🔹 العنوان */}
                          <Typography
                            fontWeight={600}
                            fontSize={16}
                            sx={{
                              textAlign: isRTL ? "right" : "left",
                              direction: isRTL ? "rtl" : "ltr",
                            }}
                          >
                            {book.title}
                          </Typography>

                          {/* 🔹 الوصف */}
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 1,
                              color: "#7a869a",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textAlign: isRTL ? "right" : "left",
                              direction: isRTL ? "rtl" : "ltr",
                            }}
                          >
                            {book.description || "No description available."}
                          </Typography>
                        </Box>
                      </Box>

                      {/* 🔹 divider */}
                      <Box
                        sx={{
                          mt: 2,
                          px: 2, // 👈 يمين + شمال
                          pb: 2, // 👈 تحت
                        }}
                      >
                        {/* 🔹 الطلاب + البروغرس */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 2,
                            pt: 2,
                          }}
                        >
                          {/* 🔹 الطلاب */}
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            sx={{ flex: 1 }}
                          >
                            <PeopleAltIcon
                              sx={{ fontSize: 18, color: "#6b7280" }}
                            />
                            <Typography variant="body2" color="#535353">
                              {getStudentsCount(book.id)} Students
                            </Typography>
                          </Box>

                          {/* 🔹 الخط العمودي */}
                          <Box
                            sx={{
                              width: "1px",
                              height: "40px",
                              backgroundColor: "#E6EAF0",
                              mx: 2,
                            }}
                          />

                          {/* 🔹 البروغرس */}
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                            sx={{ flex: 1 }}
                          >
                            <Box position="relative" display="inline-flex">
                              {/* 🔹 الخلفية الرمادية */}
                              <CircularProgress
                                variant="determinate"
                                value={100}
                                size={36}
                                thickness={4}
                                sx={{
                                  color: "#E6EAF0",
                                  position: "absolute",
                                  left: 0,
                                }}
                              />

                              {/* 🔹 التقدم الأخضر */}
                              <CircularProgress
                                variant="determinate"
                                value={64}
                                size={36}
                                thickness={4}
                                sx={{
                                  color: "#22c55e",
                                }}
                              />
                            </Box>

                            {/* 🔹 النص */}
                            <Box>
                              <Typography fontWeight={600} fontSize={14}>
                                64%
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "#9AA5B1", fontSize: 10 }}
                              >
                                Avg. Progress
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* 🔹 الأزرار */}
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              );
            })
          ) : (
            <Box
              sx={{
                gridColumn: "1 / -1",
                textAlign: "center",
                py: 8,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#1A4D96", fontWeight: 600, mb: 1 }}
              >
                No books found
              </Typography>

              <Typography variant="body2" sx={{ color: "#7a869a" }}>
                Try changing your search or filters.
              </Typography>
            </Box>
          )}
        </Box>

        {/* 🔹 Pagination + Info */}
        {totalPages > 1 && (
          <Box
            display="grid"
            gridTemplateColumns="1fr auto 1fr"
            alignItems="center"
            mt={5}
          >
            {/* 🔹 اليسار */}
            <Typography variant="body2" color="#7a869a">
              Showing {(page - 1) * booksPerPage + 1} to{" "}
              {Math.min(page * booksPerPage, sortedBooks.length)} of{" "}
              {sortedBooks.length} books
            </Typography>

            {/* 🔹 النص (Pagination بالنص) */}
            <Box display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    border: "1px solid #E6EAF0",
                    color: "#535353",
                    minWidth: 36,
                    height: 36,
                  },

                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: "#f5f7fb",
                  },

                  "& .Mui-selected": {
                    backgroundColor: "#1A4D96 !important",
                    color: "#fff",
                    border: "1px solid #1A4D96",
                  },

                  "& .MuiPaginationItem-previousNext": {
                    backgroundColor: "#fff",
                    border: "1px solid #E6EAF0",
                  },
                }}
              />
            </Box>

            {/* 🔹 اليمين (فاضي حالياً أو dropdown لاحقاً) */}
            <Box />
          </Box>
        )}
      </Box>
    </Box>
  );
}
