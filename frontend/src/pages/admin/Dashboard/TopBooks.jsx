import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTopBooks } from "../../../api";

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
            marginLeft:2
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
          borderTop: "1px solid #eee",
          pt: 1.5,
          mt: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          onClick={() => navigate("/admin/books")}
          sx={{
            fontSize: 12,
            color: "#3B6DB5",
            marginLeft:2,
            cursor: "pointer",
          }}
        >
          View all books{" "}
        </Typography>

        <Typography
          onClick={() => navigate("/admin/books")}
          sx={{ fontSize: 22, color: "#3B6DB5", cursor: "pointer" }}
        >
          ›
        </Typography>
      </Box>
    </Box>
  );
}
