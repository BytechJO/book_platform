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
  Select,
  MenuItem,
  FormControl,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import SearchIcon from "@mui/icons-material/Search";
import { useState, useMemo } from "react";
import { useGetBooks, useGetCodes } from "../../../api";
import EditIconButton from "../../../components/icons/EditIconButton";
import DeleteIconButton from "../../../components/icons/DeleteIconButton";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/api/axios";
import ENDPOINTS from "src/api/endpoints";
import CurveLoader from "../../../components/CurveLoader";

export default function Books() {
  const currentYear = new Date().getFullYear();
  const { books = [], refetch, loading } = useGetBooks();
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { codes } = useGetCodes();
  const [yearFilter, setYearFilter] = useState(currentYear.toString());
  const [platformFilter, setPlatformFilter] = useState([]);
  const [sortByUsage, setSortByUsage] = useState("");
  const navigate = useNavigate();
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // 🔍 Search
    if (search) {
      result = result.filter((b) =>
        b.title?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 📅 Year filter (based on created_at)
    if (yearFilter !== "all") {
      result = result.filter((b) => {
        const year = new Date(b.created_at).getFullYear().toString();
        return year === yearFilter;
      });
    }

    // 📱 Available on (MULTI SELECT)
    if (platformFilter.length > 0) {
      result = result.filter((b) => {
        return platformFilter.some((platform) => {
          if (platform === "app") return !!b.app_store_url;
          if (platform === "google") return !!b.google_play_url;
          if (platform === "web") return !!b.online_book_url;
          return false;
        });
      });
    }

    // 📊 Sort by usage
    if (sortByUsage) {
      result.sort((a, b) => {
        const aUsed = codes.filter(
          (c) => c.book_id === a.id && c.is_used,
        ).length;

        const bUsed = codes.filter(
          (c) => c.book_id === b.id && c.is_used,
        ).length;

        return sortByUsage === "most" ? bUsed - aUsed : aUsed - bUsed;
      });
    }

    return result;
  }, [books, search, yearFilter, platformFilter, sortByUsage, codes]);
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
  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);
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
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            pb: 2,
            borderBottom: "2px solid #e3ecf8", // 🔥
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 34,
                fontWeight: 700,
                color: "#2B5A9E",
              }}
            >
              All Books
            </Typography>

            <Typography sx={{ fontSize: 14, color: "#7a869a" }}>
              Manage and explore your books
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("create")}
            startIcon={<AddIcon />}
            fullWidth={{ xs: true, sm: false }} // 🔥 موبايل full width
            sx={{
              height: { xs: 42, sm: 36 }, // 🔥 أكبر شوي للموبايل
              px: { xs: 2, sm: 3 },
              mt: { xs: 2, sm: 0 }, // 🔥 ينزل تحت بالmobile
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: 14, sm: 15 },
              backgroundColor: "#2B5A9E",
              whiteSpace: "nowrap",
            }}
          >
            Create Book
          </Button>
        </Box>
        {/* Search */}
        {/* Search */}
        <Box
          sx={{
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 2,
            mb: 3,
            alignItems: "end",
          }}
        >
          {/* Search */}
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Search
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search books..."
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

          {/* Year */}
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Year
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                renderValue={(value) => (value === "all" ? "All" : value)}
              >
                {/* السنة الحالية */}
                <MenuItem value={currentYear.toString()}>
                  {currentYear}
                </MenuItem>

                {/* السنوات السابقة */}
                <MenuItem value={(currentYear - 1).toString()}>
                  {currentYear - 1}
                </MenuItem>

                <MenuItem value={(currentYear - 2).toString()}>
                  {currentYear - 2}
                </MenuItem>

                <MenuItem value={(currentYear - 3).toString()}>
                  {currentYear - 3}
                </MenuItem>

                {/* خيار الكل */}
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Available On */}
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Available On
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                multiple
                displayEmpty // 🔥 هذا السطر المهم
                value={platformFilter}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value.includes("all")) {
                    setPlatformFilter([]);
                  } else {
                    setPlatformFilter(value);
                  }
                }}
                renderValue={(selected) => {
                  if (!selected || selected.length === 0) {
                    return <Typography>All</Typography>;
                  }

                  const map = {
                    app: "App Store",
                    google: "Google Play",
                    web: "Online Book",
                  };

                  return (
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {selected.map((v) => (
                        <Chip
                          key={v}
                          label={map[v]}
                          size="small"
                          sx={{
                            backgroundColor: "#E8F0FE",
                            color: "#2B5A9E",
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>
                  );
                }}
              >
                <MenuItem value="all">
                  <Checkbox checked={platformFilter.length === 0} />
                  All
                </MenuItem>
                <MenuItem value="app">
                  <Checkbox checked={platformFilter.includes("app")} />
                  App Store
                </MenuItem>

                <MenuItem value="google">
                  <Checkbox checked={platformFilter.includes("google")} />
                  Google Play
                </MenuItem>

                <MenuItem value="web">
                  <Checkbox checked={platformFilter.includes("web")} />
                  Online Book
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Usage */}
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Sort by Usage
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={sortByUsage || "default"}
                onChange={(e) =>
                  setSortByUsage(
                    e.target.value === "default" ? "" : e.target.value,
                  )
                }
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="most">Most Used</MenuItem>
                <MenuItem value="least">Least Used</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Grid */}
        {filteredBooks.length === 0 ? (
          <Box
            sx={{
              width: "100%",
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "#7a869a",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                No books found
              </Typography>

              <Typography variant="body2">
                Try adjusting your search or filters
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
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
            {filteredBooks.map((book) => {
              const bookCodes = codes.filter((c) => c.book_id === book.id);

              const totalCodes = bookCodes.length;
              const usedCodes = bookCodes.filter((c) => c.is_used).length;

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
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        flexDirection: isArabic(book.title)
                          ? "row-reverse"
                          : "row",
                      }}
                    >
                      <Typography
                        fontWeight={400}
                        fontSize={20}
                        color="#535353"
                        dir={isArabic(book.title) ? "rtl" : "ltr"} // 👈 الأفضل
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textAlign: isArabic(book.title) ? "right" : "left",
                        }}
                      >
                        {book.title}
                      </Typography>
                      {book.online_book_url && (
                        <Chip
                          label="WEB"
                          size="small"
                          sx={{
                            backgroundColor: "#2B5A9E73",
                            color: "#2B5A9E",
                            fontWeight: 400,
                            borderRadius: "3px",

                            ml: isArabic(book.title) ? 0 : 1,
                            mr: isArabic(book.title) ? 1 : 0,
                          }}
                        />
                      )}
                    </Stack>
                    <Typography
                      variant="body2"
                      fontSize={{
                        xs: 8,
                        sm: 10,
                        md: 12,
                      }}
                      sx={{
                        mt: 1,
                        color: "#7a869a",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        direction: isArabic(book.description) ? "rtl" : "ltr",
                        textAlign: isArabic(book.description)
                          ? "right"
                          : "left",
                      }}
                    >
                      {book.description || "No description available."}
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

                    <Typography
                      variant="caption"
                      sx={{ mt: 1, color: "#7a869a" }}
                    >
                      Codes: {usedCodes} / {totalCodes}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
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
