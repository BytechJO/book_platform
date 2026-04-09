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
import { useGetPuplicBooks } from "../../api";
import "animate.css";
import CurveLoader from "../../components/CurveLoader";

export default function BookSeries() {
  const isArabic = (text) => /[\u0600-\u06FF]/.test(text || "");

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
    return <CurveLoader />;
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
              xs: "repeat(2, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: {
              xs: 3,
              sm: 4,
              md: 10,
            },
          }}
        >
          {filteredBooks.map((book, index) => {
            const isVisible = index <= visibleIndex;
            const isRTL = isArabic(book.title || book.description);

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
                    sx={{
                      direction: isRTL ? "rtl" : "ltr",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    <Typography
                      fontWeight={500}
                      fontSize={{
                        xs: 14,
                        sm: 16,
                        md: 18,
                      }}
                      color="#535353"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        direction: isRTL ? "rtl" : "ltr",
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {book.title}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: "#7a869a",
                      direction: isRTL ? "rtl" : "ltr",
                      textAlign: isRTL ? "right" : "left",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                    fontSize={12}
                  >
                    {book.description || "No description available."}
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
