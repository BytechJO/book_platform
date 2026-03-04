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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WelcomeBanner from "../WelcomeBanner";
import { useGetMyBooks } from "../../../api/user_books";
import { useNavigate } from "react-router-dom";
import SiteLoader from "src/components/SiteLoade";

export default function TeacherBooks() {
  const { books, loading } = useGetMyBooks();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const booksPerPage = 8;

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
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

      case "oldest":
        return result.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at),
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
    return <SiteLoader fullScreen text="Loading Books..." />;
  }
  return (
    <Box>
      <Helmet>
        <title>Teacher Books - Teacher Dashboard</title>
      </Helmet>
      <WelcomeBanner />

      {/* 🔹 Filters Section */}
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: 4,
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr " },
            gap: 2,
            alignItems: "end",
          }}
        >
          {/* Search */}
          <Box>
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
          maxWidth: 1200,
          mx: "auto",
          px: 4,
          pb: 6,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 6,
          }}
        >
          {paginatedBooks.length > 0 ? (
            paginatedBooks.map((book) => (
              <Card
                key={book.id}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                  },
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/teacher/books/${book.id}`)}
              >
                <CardMedia
                  component="img"
                  image={book.cover_image_url_short}
                  alt={book.title}
                  sx={{
                    width: "100%",
                    aspectRatio: "3 / 4",
                    objectFit: "cover",
                  }}
                />

                <CardContent>
                  <Typography fontSize={18} color="#535353" noWrap>
                    {book.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: "#7a869a",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {book.description || "No description available."}
                  </Typography>
                </CardContent>
              </Card>
            ))
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

        {/* 🔹 Pagination */}
        {totalPages > 1 && (
          <Stack alignItems="center" sx={{ mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              shape="circular"
              siblingCount={1}
              boundaryCount={1}
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: "50%",
                  fontWeight: 500,
                },

                "& .Mui-selected": {
                  border: "1px solid #1A4D96",
                  backgroundColor: "#fff !important",
                  color: "#000000",
                },

                "& .MuiPaginationItem-previousNext": {
                  backgroundColor: "#1A4D96",
                },

                "& .MuiPaginationItem-previousNext:hover": {
                  backgroundColor: "#E2E8F0",
                },
              }}
            />
          </Stack>
        )}
      </Box>
    </Box>
  );
}
