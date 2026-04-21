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

  const booksPerPage = 8;
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
              md: "repeat(4, 1fr)",
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
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "0.3s ease",
                  cursor: "pointer",
                  transform: {
                    xs: "scale(0.92)",
                    sm: "scale(1)",
                  },
                  transformOrigin: "top center",
                  opacity: 0,

                  animation: isVisible
                    ? `${fadeInUp} 0.8s ease-out ${index * 0.5}s forwards`
                    : "none",

                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",

                    "& .book-cover": {
                      transform: "scale(1.1)",
                    },
                  },
                }}
                onClick={() => navigate(`/books/${book.id}`)}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 240, // 👈 ثبّت الارتفاع
                    backgroundColor: "#739ebd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2, // 👈 هذا المهم عشان يبين الفراغ من كل الجهات
                    boxSizing: "border-box",
                  }}
                >
                  <Box
                    component="img"
                    src={book.cover_image_url_short}
                    alt={book.title}
                    className="book-cover"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      transition: "transform 0.4s ease",
                    }}
                  />
                </Box>

                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      flexDirection: isRTL ? "row-reverse" : "row",
                    }}
                  >
                    <Typography
                      fontSize={{
                        xs: 12,
                        sm: 16,
                        md: 18,
                      }}
                      color="#535353"
                      noWrap
                      fontWeight={600}
                      sx={{
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
                      fontSize: {
                        xs: 11,
                        sm: 14,
                      },
                      mt: 1,
                      color: "#7a869a",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      fontWeight: 400,
                      direction: isRTL ? "rtl" : "ltr",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {book.description || "No description available."}
                  </Typography>
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
