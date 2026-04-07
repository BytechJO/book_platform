import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import SiteLoader from "src/components/SiteLoade";
import { useGetPuplicBooks } from "../../api";
import "animate.css";

export default function BookSeries() {
  const { books, loading } = useGetPuplicBooks();
  const [search, setSearch] = useState("");
  const [visibleIndex, setVisibleIndex] = useState(0);
  const filteredBooks = useMemo(() => {
    if (!search) return books;
    return books.filter((b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [books, search]);
  useEffect(() => {
    if (visibleIndex < filteredBooks.length) {
      const timer = setTimeout(() => {
        setVisibleIndex((prev) => prev + 1);
      }, 500); // مدة الأنيميشن ⏱️

      return () => clearTimeout(timer);
    }
  }, [visibleIndex, filteredBooks.length]);
  const navigate = useNavigate();

  if (loading) {
    return <SiteLoader fullScreen text="Loading Books..." />;
  }
  return (
    <Box sx={{ py: 3 }}>
      <Helmet>
        <title>Books - Admin Dashboard</title>
      </Helmet>
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: { xs: 2, md: 2 },
        }}
      >
        {/* Title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: "40px",
              fontWeight: 400,
              color: "#2d5aa7",
            }}
          >
            All Books
          </Typography>
        </Box>
        {/* Search */}
        <Box sx={{ maxWidth: 350, mb: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search in books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Grid */}
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 10,
          }}
        >
          {filteredBooks.map((book, index) => {
            const isVisible = index <= visibleIndex;

            return (
              <Card
                key={book.id}
                className={
                  isVisible ? "animate__animated animate__fadeInUp" : ""
                }
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  opacity: isVisible ? 1 : 0,
                }}
                onClick={() => navigate(`/books/${book.id}`)}
              >
                <CardMedia
                  component="img"
                  image={book.cover_image_url_short}
                  alt={book.title}
                  sx={{
                    width: "100%",
                    aspectRatio: "3 / 4",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      fontWeight={400}
                      fontSize={20}
                      color="#535353"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {book.title}
                    </Typography>

                    <Chip
                      label="WEB"
                      size="small"
                      sx={{
                        backgroundColor: "#2B5A9E73",
                        color: "#2B5A9E",
                        fontWeight: 400,
                        borderRadius: "3px",
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "#7a869a" }}
                    fontSize={12}
                  >
                    {book.description
                      ? book.description.slice(0, 30) +
                        (book.description.length > 30 ? "..." : "")
                      : "No description available."}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, color: "#7a869a" }}
                  ></Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
