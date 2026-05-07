import { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Pagination,
  keyframes,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetPuplicBooks } from "../../../api";

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function BookSlider() {
  const isArabic = (text) => /[\u0600-\u06FF]/.test(text || "");
  const { books } = useGetPuplicBooks();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  const booksPerPage = 6;
  const totalPages = Math.ceil(books.length / booksPerPage);

  const paginatedBooks = useMemo(() => {
    const startIndex = (page - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return books.slice(startIndex, endIndex);
  }, [page, books]);

  useEffect(() => {
    const currentRef = containerRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.2,
      },
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);
  // إعادة تعيين الأنيميشن عند تغيير الصفحة (اختياري: ليشتغل الأنيميشن للصفحة الجديدة)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [page]);

  return (
    <Box ref={containerRef}>
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
          {paginatedBooks.map((book, index) => {
            const isRTL = isArabic(book.title || book.description);
            return (
              <Card
                key={book.id}
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  border: "1px solid #eef1f5",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                  transition: "0.3s ease",
                  cursor: "pointer",
                  opacity: 0,

                  animation: isVisible
                    ? `${fadeInUp} 0.8s ease-out ${index * 0.15}s forwards`
                    : "none",

                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",

                    "& .book-cover": {
                      transform: "scale(1.05)",
                    },
                  },
                }}
                onClick={() => navigate(`/books/${book.id}`)}
              >
                {/* IMAGE SECTION */}
                <Box
                  sx={{
                    p: 2,
                    pb: 1,
                  }}
                >
                  <Box
                    sx={{
                      height: 170,
                      borderRadius: "16px",
                      background: "#f7f9fc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={book.cover_image_url_short}
                      alt={book.title}
                      className="book-cover"
                      sx={{
                        width: "85%",
                        height: "85%",
                        objectFit: "contain",
                        transition: "transform 0.4s ease",
                      }}
                    />
                  </Box>
                </Box>

                {/* CONTENT */}
                <CardContent
                  sx={{
                    pt: 1,
                    px: 2.2,
                    pb: "18px !important",
                  }}
                >
                  {/* CATEGORY */}
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      px: 1.2,
                      py: 0.4,
                      borderRadius: "999px",
                      backgroundColor: "#eef7ee",
                      color: "#4caf50",
                      fontSize: 11,
                      fontWeight: 600,
                      mb: 1.2,
                    }}
                  >
                    {book.category || ""}
                  </Box>

                  {/* TITLE */}
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#1d1d1f",
                      mb: 1,
                      lineHeight: 1.3,
                      direction: isRTL ? "rtl" : "ltr",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {book.title}
                  </Typography>

                  {/* DESCRIPTION */}
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "#7b8190",
                      lineHeight: 1.7,
                      minHeight: 48,
                      mb: 2,
                      direction: isRTL ? "rtl" : "ltr",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {(book.description || "No description available.").slice(
                      0,
                      70,
                    )}
                    ...
                  </Typography>

                  {/* BUTTONS */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        flex: 1,
                        height: 42,
                        borderRadius: "12px",
                        border: "1px solid #d7e3ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2563eb",
                        fontWeight: 600,
                        fontSize: 14,
                        transition: "0.2s",

                        "&:hover": {
                          backgroundColor: "#f5f9ff",
                        },
                      }}
                    >
                      📖 View Book
                    </Box>

                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        color: "#6b7280",
                        transition: "0.2s",

                        "&:hover": {
                          backgroundColor: "#f8fafc",
                        },
                      }}
                    >
                      →
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
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
                  transition: "all 0.2s ease",
                },

                "& .Mui-selected": {
                  border: "1px solid #1A4D96",
                  backgroundColor: "#fff !important",
                  color: "#000000",
                  transform: "scale(1.1)",
                },

                "& .MuiPaginationItem-previousNext": {
                  backgroundColor: "#1A4D96",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#1A4D96",
                    opacity: 0.9,
                  },
                },
              }}
            />
          </Stack>
        )}
      </Box>
    </Box>
  );
}
