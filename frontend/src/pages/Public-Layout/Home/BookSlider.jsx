import { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Pagination,
  keyframes, // 1. استيراد keyframes
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetPuplicBooks } from "../../../api";

// 2. تعريف الأنيميشن (ظهور من الأسفل للأعلى)
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

  // 3. State لتفعيل الأنيميشن عند الوصول بالسكرول
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  const booksPerPage = 8;
  const totalPages = Math.ceil(books.length / booksPerPage);

  const paginatedBooks = useMemo(() => {
    const startIndex = (page - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return books.slice(startIndex, endIndex);
  }, [page, books]);

  // 4. Intersection Observer: يكتشف متى وصل السكرول للعنصر
  useEffect(() => {
    const currentRef = containerRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true); // دخل السيكشن
        } else {
          setIsVisible(false); // طلع من السيكشن 👈 هون السر
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
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 6,
          }}
        >
          {paginatedBooks.map((book, index) => {
            const isTitleRTL = isArabic(book.title);
            const isDescRTL = isArabic(book.description);

            return (
              <Card
                key={book.id}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "0.3s ease",
                  cursor: "pointer",

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
                <CardMedia
                  component="img"
                  className="book-cover" // كلاس للتحكم بالصورة
                  image={book.cover_image_url_short}
                  alt={book.title}
                  sx={{
                    width: "100%",
                    aspectRatio: "3 / 4",
                    objectFit: "cover",
                    transition: "transform 0.4s ease", // حركة سلسة للصورة
                  }}
                />

                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      fontSize={18}
                      color="#535353"
                      noWrap
                      fontWeight={600}
                      sx={{
                        direction: isTitleRTL ? "rtl" : "ltr",
                        textAlign: isTitleRTL ? "right" : "left",
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
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      fontWeight: 400,
                      direction: isDescRTL ? "rtl" : "ltr",
                      textAlign: isDescRTL ? "right" : "left",
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
