import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "src/api/axios";
import ENDPOINTS from "src/api/endpoints";
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Card,
  Dialog,
  DialogContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PublishIcon from "@mui/icons-material/Publish";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BookTopSection from "./BookTopSection";
import BottomSection from "./BottomSection";
import UserBookPreview from "./UserBookPreview";
import { useGetCodes } from "../../../api";
import CurveLoader from "../../../components/CurveLoader";
export default function ViewBook() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { codes = [] } = useGetCodes();
  const usedCodes = book
    ? codes.filter((c) => c.book_id === book.id && c.is_used).length
    : 0;
  const handleDelete = async () => {
    try {
      setDeleting(true);

      await axiosInstance.delete(ENDPOINTS.BOOKS.DELETE(book.id));

      // 🔥 رجوع للصفحة الرئيسية
      navigate("/admin/books");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };
  const handleTogglePublish = async (book) => {
    try {
      setLoading(true);

      await axiosInstance.patch(ENDPOINTS.BOOKS.STATUS(book.id));

      const res = await axiosInstance.get(ENDPOINTS.BOOKS.BY_ID(book.id));
      setBook(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleDuplicate = async () => {
    try {
      setLoading(true);

      await axiosInstance.post(`/api/books/${book.id}/duplicate`);

      navigate("/admin/books"); // أو refetch إذا بدك تبقى هون
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const isLong = book?.description?.length > 200;

  useEffect(() => {
    const fetchBook = async () => {
      const res = await axiosInstance.get(ENDPOINTS.BOOKS.BY_ID(id));
      setBook(res.data);
    };
    fetchBook();
  }, [id]);

  if (!book)  return <CurveLoader />;;

  return (
    <Box sx={{ px: 3, py: 2 }}>
      {/* 🔥 HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        {/* LEFT */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: "#f4f6f8",
              borderRadius: "8px",
            }}
          >
            <ArrowBackIcon sx={{ color: "#2B5A9E" }} />{" "}
          </IconButton>

          <Typography sx={{ color: "#7a869a", fontSize: 14 }}>Books</Typography>

          <Typography sx={{ color: "#7a869a" }}>{">"}</Typography>

          <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
            Book Details
          </Typography>
        </Stack>

        {/* RIGHT */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            sx={btnStyle}
            onClick={() => setOpenPreview(true)}
          >
            Preview
          </Button>

          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={btnStyle}
            onClick={() => navigate(`/admin/books/${book.id}/edit`)}
          >
            Edit Book
          </Button>

          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            sx={btnStyle}
            onClick={handleDuplicate}
            disabled={loading}
          >
            {loading ? "Duplicating..." : "Duplicate"}
          </Button>

          <Button
            variant={book.status === "Published" ? "outlined" : "contained"}
            startIcon={<PublishIcon />}
            disabled={loading}
            sx={{
              ...btnStyle,
              ...(book.status === "Published"
                ? {
                    borderColor: "#f59e0b",
                    color: "#f59e0b",
                  }
                : {
                    backgroundColor: "#2e7d32",
                    "&:hover": { backgroundColor: "#27682b" },
                  }),
            }}
            onClick={() => handleTogglePublish(book)}
          >
            {book.status === "Published" ? "Draft" : "Publish"}
          </Button>

          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            sx={{
              ...btnStyle,
              borderColor: "#d32f2f",
              color: "#d32f2f",
            }}
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </Button>
        </Stack>
      </Box>

      {/* 🔥 CONTENT */}
      <BookTopSection book={book} />
      <BottomSection book={book} usedCodes={usedCodes} />
      <Card
        sx={{
          mt: 2,
          p: 3,
          borderRadius: "14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            mb: 1,
            color: "#2B5A9E",
          }}
        >
          Book Description
        </Typography>

        <Typography
          sx={{
            color: "#6b7280",
            fontSize: 14,
            lineHeight: 1.8,
            whiteSpace: "pre-line", // 🔥 يحافظ على الفقرات
          }}
        >
          {expanded || !isLong
            ? book.description
            : book.description.slice(0, 200) + "..."}
        </Typography>

        {/* 🔥 Show More */}
        {isLong && (
          <Box
            onClick={() => setExpanded(!expanded)}
            sx={{
              mt: 1,
              color: "#2B5A9E",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              width: "fit-content",
            }}
          >
            {expanded ? "Show less" : "Show more"}
          </Box>
        )}
      </Card>
      <Box
        sx={{
          mt: 2,
          pt: 2,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 13,
            color: "#9ca3af",
            letterSpacing: 0.5,
          }}
        >
          alrowadpub.com
        </Typography>
      </Box>
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {/* 🔥 هون تحط UI تبع اليوزر */}
          <UserBookPreview book={book} />
        </DialogContent>
      </Dialog>
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogContent sx={{ p: 3, minWidth: 300 }}>
          <Typography fontWeight={600} mb={1}>
            Delete Book
          </Typography>

          <Typography sx={{ fontSize: 14, color: "#666" }}>
            Are you sure you want to delete this book?
          </Typography>

          <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
const btnStyle = {
  textTransform: "none",
  borderRadius: "8px",
  fontWeight: 500,
};
