import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTopBooks } from "../../../api";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function TopBooks() {
  const navigate = useNavigate();
  const { books, loading } = useTopBooks();

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "12px",
        p: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <Typography sx={{ fontWeight: 600, color: "#1F4E8C", mb: 2 }}>
        Top Books
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 140px 80px",
          fontSize: 12,
          fontWeight: 600,
          color: "#3B6DB5",
          mb: 1.5,
          background: "#F5F7FA",
          px: 2,
          py: 1,
          borderRadius: "8px",
        }}
      >
        <span>#</span>
        <span>Book Title</span>
        <span>Published On</span>
        <span>Views</span>
      </Box>

      {/* Rows */}
      {books.map((book, index) => (
        <Box
          key={book.id}
          sx={{
            display: "grid",
            gridTemplateColumns: "40px 1fr 140px 80px",
            alignItems: "center",
            py: 1,
            fontSize: 13,
            marginLeft: 2,
          }}
        >
          {/* ترتيب */}
          <span>{index + 1}</span>

          {/* عنوان */}
          <span>{book.title}</span>

          {/* تاريخ */}
          <span>
            {new Date(book.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>

          {/* views */}
          <span>{book.views}</span>
        </Box>
      ))}

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0.5,
          pt: 2,
          borderTop: "1px solid #eee",
          mt: "auto",
        }}
      >
        <Typography
          onClick={() => navigate("/admin/books")}
          sx={{
            fontSize: 12,
            color: "#3f51b5",
            fontWeight: 500,
            cursor: "pointer",

            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          View all books
        </Typography>

        <ArrowForwardIosIcon
          sx={{
            fontSize: 12,
            color: "#3f51b5",
            ml: 0.5,
          }}
        />
      </Box>
    </Box>
  );
}
