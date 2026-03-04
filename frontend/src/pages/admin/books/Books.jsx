import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useMemo } from "react";
import { useGetBooks } from "../../../api";
import EditIconButton from "../../../components/icons/EditIconButton";
import DeleteIconButton from "../../../components/icons/DeleteIconButton";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/api/axios";
import ENDPOINTS from "src/api/endpoints";
import SiteLoader from "src/components/SiteLoade";

export default function Books() {
  const { books = [], refetch, loading } = useGetBooks();
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();
  const filteredBooks = useMemo(() => {
    if (!search) return books;
    return books.filter((b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [books, search]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await axiosInstance.delete(ENDPOINTS.BOOKS.DELETE(selectedBookId));

      setDeleteDialogOpen(false);
      setSelectedBookId(null);
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };
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
              fontFamily: "IBM Plex Sans Thai Looped",
              fontSize: "40px",
              fontWeight: 400,
              color: "#2d5aa7",
            }}
          >
            All Books
          </Typography>

          <Button
            variant="contained"
            onClick={() => {
              navigate("create");
            }}
            sx={{
              height: 36,
              px: 3,
              borderRadius: "4px",
              textTransform: "none",
              fontWeight: 500,
              fontSize: 15,
              backgroundColor: "#2B5A9E",
            }}
          >
            Create Book
          </Button>
        </Box>
        {/* Search */}
        <Box sx={{ maxWidth: 350, mb: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search in your courses..."
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
          {filteredBooks.map((book) => (
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
              onClick={() => navigate(`/admin/books/${book.id}`)}
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
                    fontSize={24}
                    fontFamily="Poppins"
                    color="#535353"
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

                <Typography variant="body2" sx={{ mt: 1, color: "#7a869a" }}>
                  {book.description
                    ? book.description.slice(0, 30) +
                      (book.description.length > 30 ? "..." : "")
                    : "No description available."}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/books/${book.id}/edit`);
                    }}
                    sx={{
                      p: 0,
                      width: 34,
                      height: 34,
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#e3ecf8",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <EditIconButton size={32} />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBookId(book.id);
                      setDeleteDialogOpen(true);
                    }}
                    sx={{
                      p: 0,
                      width: 34,
                      height: 34,
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#fdeaea",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <DeleteIconButton size={32} />
                  </IconButton>
                </Stack>

                <Typography variant="caption" sx={{ mt: 1, color: "#7a869a" }}>
                  Codes: {book.codes_count || 0} used
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Book</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete this book? This action cannot be
            undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: "none" }}
            disabled={deleteLoading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
            sx={{
              textTransform: "none",
              minWidth: 100,
            }}
          >
            {deleteLoading ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
