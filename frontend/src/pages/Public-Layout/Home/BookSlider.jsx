import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetPuplicBooks } from "../../../api";

export default function BookSlider() {
  const isArabic = (text) => /[\u0600-\u06FF]/.test(text || "");
  const { books } = useGetPuplicBooks();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const booksPerPage = 8;
  // 🔹 Pagination Logic
  const totalPages = Math.ceil(books.length / booksPerPage);

  const paginatedBooks = useMemo(() => {
    const startIndex = (page - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return books.slice(startIndex, endIndex);
  }, [page, books]);

  return (
    <Box>
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
          {paginatedBooks.map((book) => {
            const isTitleRTL = isArabic(book.title);
            const isDescRTL = isArabic(book.description);

            return (
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
