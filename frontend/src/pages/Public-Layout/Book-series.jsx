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
import img from "../../assets/Books.png";
export default function BookSeries() {
  const isArabic = (text) => /[\u0600-\u06FF]/.test(text || "");
  const [selectedCategory, setSelectedCategory] = useState("All Books");
  const { books, loading } = useGetPuplicBooks();
  const [search, setSearch] = useState("");
  const [visibleIndex, setVisibleIndex] = useState(0);
  const filteredBooks = useMemo(() => {
    let filtered = books;

    // Search
    if (search) {
      filtered = filtered.filter((b) =>
        b.title?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category
    if (selectedCategory !== "All Books") {
      filtered = filtered.filter(
        (b) =>
          b.category?.trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase(),
      );
    }
    return filtered;
  }, [books, search, selectedCategory]);
  const categories = [
    "All Books",
    ...new Set(books.map((b) => b.category).filter(Boolean)),
  ];
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
    <Box
      sx={{
        py: 3,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)",
      }}
    >
      <Helmet>
        <title>Books - Admin Dashboard</title>
      </Helmet>
      <Box
        sx={{
          maxWidth: "80%",
          mx: "auto",
          background: "linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)",
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            borderRadius: "32px",
            mb: 6,
          }}
        >
          {/* Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
              mb: 4,
            }}
          >
            {/* LEFT */}
            <Box>
              {/* Title */}
              <Typography
                sx={{
                  fontSize: { xs: 38, md: 44 },
                  fontWeight: 800,
                  color: "#16315c",
                  mb: 2,
                  textAlign: "left",
                  mt: 4,
                  lineHeight: 1.1,
                }}
              >
                Explore Our Library
              </Typography>

              {/* Subtitle */}
              <Typography
                sx={{
                  fontSize: 16,
                  color: "#6b7a90",
                  textAlign: "left",
                }}
              >
                Discover engaging books that inspire learning and imagination.
              </Typography>
            </Box>

            {/* RIGHT IMAGE */}
            <Box
              component="img"
              src={img}
              alt="Books"
              sx={{
                width: { xs: 160, md: 260 },
                objectFit: "contain",
                display: { xs: "none", md: "block" },
              }}
            />
          </Box>
          {/* Search */}
          <Box
            sx={{
              width: "100%",
              background: "#fff",
              borderRadius: "999px",
              px: 1.5,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              border: "1px solid #edf1f7",
            }}
          >
            <TextField
              fullWidth
              placeholder="Search books, topics, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: "#94a3b8",
                        fontSize: 22,
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                px: 1,
                "& input": {
                  py: 1.2,
                  fontSize: 15,
                },
              }}
            />

            <Button
              variant="contained"
              sx={{
                borderRadius: "999px",
                px: 4,
                minWidth: 120,
                fontSize: 15,
                textTransform: "none",
                fontWeight: 700,
                background: "#2563eb",
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: `repeat(${Math.min(categories.length, 5)}, 1fr)`,
            },
            gap: 2,
            mb: 5,
            width: "100%",
          }}
        >
          {categories.map((item) => {
            const active = selectedCategory === item;

            return (
              <Chip
                key={item}
                label={item}
                clickable
                onClick={() => setSelectedCategory(item)}
                sx={{
                  width: "100%",
                  height: 45,
                  fontSize: 15,
                  borderRadius: "999px",
                  backgroundColor: active ? "#2563eb" : "#fff",
                  color: active ? "#fff" : "#5b6780",
                  fontWeight: 600,
                  border: "1px solid #e6ebf2",

                  "&:hover": {
                    backgroundColor: active ? "#2563eb" : "#f3f6fb",
                  },
                }}
              />
            );
          })}
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
              md: 6,
            },
          }}
        >
          {filteredBooks.map((book, index) => {
            const isRTL = isArabic(book.title || book.description);
            const isVisible = index <= visibleIndex;
            return (
              <Card
                key={book.id}
                className={
                  isVisible ? "animate__animated animate__fadeInUp" : ""
                }
                sx={{
                  borderRadius: "24px",
                  p: 2,
                  border: "1px solid #edf1f7",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                  transition: "0.3s",
                  cursor: "pointer",

                  display: "flex",
                  flexDirection: "column",
                  height: "100%",

                  opacity: isVisible ? 1 : 0,

                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Box
                  sx={{
                    background: "#f5f7fb",
                    borderRadius: "20px",
                    p: 2,
                    mb: 2,
                    height: 260,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={book.cover_image_url_short}
                    alt={book.title}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1e293b",
                    mb: 1,
                    direction: isRTL ? "rtl" : "ltr",
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {book.title}
                </Typography>

                <Typography
                  sx={{
                    color: "#7b8794",
                    fontSize: 12,
                    lineHeight: 1.7,
                    mb: 3,
                    direction: isRTL ? "rtl" : "ltr",
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {(book.short_description || book.description || "").slice(
                    0,
                    90,
                  )}
                  ...
                </Typography>

                <Button
                  onClick={() => navigate(`/books/${book.id}`)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderRadius: "14px",
                    py: 1.3,
                    textTransform: "none",
                    fontWeight: 700,
                    mt: "auto",
                  }}
                >
                  📖 View Book
                </Button>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
