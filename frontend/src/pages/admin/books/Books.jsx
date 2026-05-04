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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useMemo } from "react";
import { useGetBooks } from "../../../api";
import EditIconButton from "../../../components/icons/EditIconButton";
import DeleteIconButton from "../../../components/icons/DeleteIconButton";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/api/axios";
import ENDPOINTS from "src/api/endpoints";
import CurveLoader from "../../../components/CurveLoader";
import DownloadIcon from "@mui/icons-material/Download";
import britishFlag from "../../../assets/icon/britishFlag.svg";
import franceFlag from "../../../assets/icon/franceFlag.svg";
import arabicFlag from "../../../assets/icon/arabicFlag.svg";
import Menu from "@mui/material/Menu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PublishIcon from "@mui/icons-material/Publish";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useGetCategories } from "../../../api/categories";
export default function Books() {
  const { books = [], refetch, loading } = useGetBooks();
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const { categories } = useGetCategories();
  const [duplicateLoading, setDuplicateLoading] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event, book) => {
    setAnchorEl(event.currentTarget);
    setSelectedBook(book);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedBook(null);
  };
  const handleTogglePublish = async (book) => {
    try {
      await axiosInstance.patch(ENDPOINTS.BOOKS.STATUS(book.id));
      handleClose();
      refetch(); // 🔥 تحديث الجدول
    } catch (err) {
      console.error(err);
    }
  };
  const handleExport = () => {
    const data = filteredBooks.map((b) => ({
      Title: b.title,
      ISBN: b.isbn,
      Author: b.created_by_name,
      Category: b.category_name,
      Language: b.language,
      Status: b.status,
      "Published On": b.published_at
        ? new Date(b.published_at).toLocaleDateString()
        : "",
      Views: b.views,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Books");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "books.xlsx");
  };
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // 🔍 Search
    if (search) {
      const s = search.toLowerCase();

      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(s) ||
          b.isbn?.toLowerCase().includes(s) ||
          b.created_by_name?.toLowerCase().includes(s),
      );
    }

    // ✅ Status filter
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    // ✅ Category filter
    if (categoryFilter !== "all") {
      result = result.filter((b) => b.category_id === categoryFilter);
    }

    // ✅ Language filter
    if (languageFilter !== "all") {
      result = result.filter((b) => b.language === languageFilter);
    }

    return result;
  }, [books, search, statusFilter, categoryFilter, languageFilter]);
  const getCategoryColor = (name) => {
    if (!name) return { bg: "#eee", color: "#555" };

    const map = {
      Arabic: { bg: "rgba(76,175,80,0.1)", color: "#4CAF50" },
      French: { bg: "rgba(255,152,0,0.1)", color: "#FF9800" },
      English: { bg: "rgba(33,150,243,0.1)", color: "#2196F3" },
      Math: { bg: "rgba(156,39,176,0.1)", color: "#9C27B0" },
    };

    return (
      map[name] || {
        bg: "rgba(158,158,158,0.1)",
        color: "#616161",
      }
    );
  };
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const totalPages = Math.ceil(filteredBooks.length / perPage);

  const paginatedBooks = filteredBooks.slice(
    (page - 1) * perPage,
    page * perPage,
  );
  const handleDuplicate = async (book) => {
    try {
      setDuplicateLoading(true); // 🔥 تشغيل اللودر

      await axiosInstance.post(`/api/books/${book.id}/duplicate`);

      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setDuplicateLoading(false); // 🔥 إيقاف اللودر
    }
  };
  // 🔹 Monthly Growth (عدد العناصر)
  const getMonthlyGrowth = (data) => {
    const now = new Date();

    const currentMonth = now.getUTCMonth();
    const currentYear = now.getUTCFullYear();

    const lastMonthDate = new Date(Date.UTC(currentYear, currentMonth - 1));
    const lastMonth = lastMonthDate.getUTCMonth();
    const lastMonthYear = lastMonthDate.getUTCFullYear();

    const current = data.filter((item) => {
      const d = new Date(item.created_at);
      return (
        d.getUTCMonth() === currentMonth && d.getUTCFullYear() === currentYear
      );
    }).length;

    const previous = data.filter((item) => {
      const d = new Date(item.created_at);
      return (
        d.getUTCMonth() === lastMonth && d.getUTCFullYear() === lastMonthYear
      );
    }).length;

    if (previous === 0) return current === 0 ? 0 : 100;

    return Math.round(((current - previous) / previous) * 100);
  };

  // 🔹 Monthly Growth (views)
  const getViewsGrowth = (data) => {
    const now = new Date();

    const currentMonth = now.getUTCMonth();
    const currentYear = now.getUTCFullYear();

    const lastMonthDate = new Date(Date.UTC(currentYear, currentMonth - 1));
    const lastMonth = lastMonthDate.getUTCMonth();
    const lastMonthYear = lastMonthDate.getUTCFullYear();

    const current = data
      .filter((item) => {
        const d = new Date(item.created_at);
        return (
          d.getUTCMonth() === currentMonth && d.getUTCFullYear() === currentYear
        );
      })
      .reduce((sum, b) => sum + (b.views || 0), 0);

    const previous = data
      .filter((item) => {
        const d = new Date(item.created_at);
        return (
          d.getUTCMonth() === lastMonth && d.getUTCFullYear() === lastMonthYear
        );
      })
      .reduce((sum, b) => sum + (b.views || 0), 0);

    if (previous === 0) return current === 0 ? 0 : 100;

    return Math.round(((current - previous) / previous) * 100);
  };

  // 🔹 Stats
  const totalBooks = books.length;

  const publishedList = books.filter(
    (b) => b.status?.toLowerCase() === "Published",
  );

  const draftList = books.filter((b) => b.status?.toLowerCase() === "draft");

  const publishedBooks = publishedList.length;
  const draftBooks = draftList.length;

  const totalViews = books.reduce((sum, b) => sum + (b.views || 0), 0);

  // 🔹 Percentages
  const totalPercent = getMonthlyGrowth(books);
  const publishedPercent = getMonthlyGrowth(publishedList);
  const draftPercent = getMonthlyGrowth(draftList);
  const viewsPercent = getViewsGrowth(books);

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
    return <CurveLoader />;
  }
  const getFlagIcon = (lang) => {
    if (!lang) return null;

    const l = lang.toLowerCase();

    if (l.includes("english")) return britishFlag;
    if (l.includes("arabic")) return arabicFlag;
    if (l.includes("french")) return franceFlag;

    return null;
  };
  return (
    <Box sx={{ py: 1 }}>
      <Helmet>
        <title>Books - Admin Dashboard</title>
      </Helmet>
      <Box
        sx={{
          width: "95%",
          mx: "auto",
          px: { xs: 2, md: 1 },
        }}
      >
        {/* Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            pb: 2,
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

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              flexWrap: { xs: "wrap", sm: "nowrap" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("create")}
              startIcon={<AddIcon />}
              fullWidth={{ xs: true, sm: false }}
              sx={{
                height: { xs: 42, sm: 36 },
                px: { xs: 2, sm: 3 },
                borderRadius: "6px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: 14, sm: 15 },
                backgroundColor: "#2B5A9E",
                whiteSpace: "nowrap",
              }}
            >
              Create Book
            </Button>{" "}
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport} // 🔥 هذا المهم
              sx={{
                height: { xs: 42, sm: 36 },
                px: { xs: 2, sm: 3 },
                borderRadius: "6px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: 14, sm: 15 },
                borderColor: "#dfe3e8",
                color: "#2B5A9E",
                whiteSpace: "nowrap",
              }}
            >
              Export
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <StatCard
            title="Total Books"
            value={totalBooks}
            change={`${totalPercent > 0 ? "+" : ""}${totalPercent}%`}
            changeColor={totalPercent >= 0 ? "green" : "red"}
            icon="📘"
            color="#2B5A9E"
          />

          <StatCard
            title="Published Books"
            value={publishedBooks}
            change={`${publishedPercent > 0 ? "+" : ""}${publishedPercent}%`}
            changeColor={publishedPercent >= 0 ? "green" : "red"}
            icon="📖"
            color="#2e7d32"
          />

          <StatCard
            title="Draft Books"
            value={draftBooks}
            change={`${draftPercent > 0 ? "+" : ""}${draftPercent}%`}
            changeColor={draftPercent >= 0 ? "green" : "red"}
            icon="🔖"
            color="#9C27B0"
          />

          <StatCard
            title="Total Views"
            value={totalViews.toLocaleString()}
            change={`${viewsPercent > 0 ? "+" : ""}${viewsPercent}%`}
            changeColor={viewsPercent >= 0 ? "green" : "red"}
            icon="👁️"
            color="#EF6C00"
          />
        </Box>
        {/* Search */}
        <Box
          sx={{
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
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
              placeholder="Search by title, author or ISBN"
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

          {/* Status */}
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Status
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Published">Published</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Category */}
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Category
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>

                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Language */}
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Language
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
              >
                <MenuItem value="all">All Languages</MenuItem>
                {[...new Set(books.map((b) => b.language).filter(Boolean))].map(
                  (lang) => (
                    <MenuItem key={lang} value={lang}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {getFlagIcon(lang) && (
                          <Box
                            component="img"
                            src={getFlagIcon(lang)}
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: "2px",
                            }}
                          />
                        )}

                        <Typography sx={{ fontSize: 14 }}>{lang}</Typography>
                      </Box>
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
          </Box>

          {/* Clear */}
          <Box>
            <Typography>&nbsp;</Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setLanguageFilter("all");
              }}
              sx={{
                height: 40,
                textTransform: "none",
                borderRadius: "6px",
              }}
            >
              Clear Filters
            </Button>
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
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              p: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Table
              sx={{
                width: "100%",
                tableLayout: "fixed",
                "& .MuiTableCell-root": {
                  borderBottom: "none",
                  paddingTop: "18px",
                  paddingBottom: "18px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
            >
              <colgroup>
                <col style={{ width: "25%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
              </colgroup>

              <TableHead>
                <TableRow sx={{ borderBottom: "2px solid #e0e0e0" }}>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Book
                  </TableCell>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Author
                  </TableCell>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Language
                  </TableCell>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Published On
                  </TableCell>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Views
                  </TableCell>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedBooks.map((b) => {
                  const catColor = getCategoryColor(b.category_name);

                  return (
                    <TableRow
                      key={b.id}
                      sx={{ "&:hover": { backgroundColor: "#f9fafc" } }}
                    >
                      {/* Book */}
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            component="img"
                            src={b.cover_image_url_short}
                            sx={{ width: 32, height: 42, borderRadius: "4px" }}
                          />

                          <Box>
                            <Typography sx={{ fontSize: 14 }}>
                              {b.title}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "#7a869a" }}>
                              ISBN: {b.isbn}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Author */}
                      <TableCell sx={{ color: "#555", fontSize: 14 }}>
                        {b.created_by_name || "-"}
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Chip
                          label={b.category_name || "N/A"}
                          size="small"
                          sx={{
                            backgroundColor: catColor.bg,
                            color: catColor.color,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>

                      {/* Language */}
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {getFlagIcon(b.language) && (
                            <Box
                              component="img"
                              src={getFlagIcon(b.language)}
                              sx={{
                                width: 18,
                                height: 18,
                                borderRadius: "2px",
                              }}
                            />
                          )}

                          <Typography sx={{ fontSize: 14 }}>
                            {b.language || "-"}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={b.status}
                          size="small"
                          sx={{
                            backgroundColor:
                              b.status === "Published"
                                ? "rgba(76,175,80,0.1)"
                                : "rgba(33,150,243,0.1)",
                            color:
                              b.status === "Published" ? "#4CAF50" : "#2196F3",
                          }}
                        />
                      </TableCell>

                      {/* Date */}
                      <TableCell sx={{ fontSize: 14, color: "#555" }}>
                        {b.published_at
                          ? new Date(b.published_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </TableCell>

                      {/* Views */}
                      <TableCell sx={{ fontSize: 14 }}>
                        {b.views?.toLocaleString()}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <IconButton onClick={(e) => handleClick(e, b)}>
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
                pt: 2,
                borderTop: "1px solid #eee",
              }}
            >
              {/* Left */}
              <Typography sx={{ fontSize: 12, color: "#777" }}>
                Showing {(page - 1) * perPage + 1} to{" "}
                {Math.min(page * perPage, filteredBooks.length)} of{" "}
                {filteredBooks.length} books
              </Typography>

              {/* Pagination */}
              <Box sx={{ display: "flex", gap: 1 }}>
                {/* Previous */}
                <Button
                  size="small"
                  variant="outlined"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  sx={{ minWidth: 32 }}
                >
                  {"<"}
                </Button>

                {/* Pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      size="small"
                      variant={p === page ? "contained" : "outlined"}
                      onClick={() => setPage(p)}
                      sx={{
                        minWidth: 32,
                        backgroundColor: p === page ? "#2B5A9E" : "transparent",
                        color: p === page ? "#fff" : "#2B5A9E",
                        borderColor: "#dfe3e8",
                      }}
                    >
                      {p}
                    </Button>
                  ),
                )}

                {/* Next */}
                <Button
                  size="small"
                  variant="outlined"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  sx={{ minWidth: 32 }}
                >
                  {">"}
                </Button>
              </Box>

              {/* Per Page */}
              <FormControl size="small">
                <Select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(e.target.value);
                    setPage(1); // 🔥 يرجع لأول صفحة
                  }}
                  sx={{
                    fontSize: 12,
                    borderRadius: "6px",
                    height: 32,
                  }}
                >
                  <MenuItem value={6}>6 per page</MenuItem>
                  <MenuItem value={10}>10 per page</MenuItem>
                  <MenuItem value={15}>15 per page</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        )}
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
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            minWidth: 200,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
        }}
      >
        {/* View */}
        <MenuItem
          onClick={() => {
            navigate(`/admin/books/${selectedBook.id}`);
            handleClose();
          }}
        >
          <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
          View Details
        </MenuItem>

        {/* Edit */}
        <MenuItem
          onClick={() => {
            navigate(`/admin/books/${selectedBook.id}/edit`);
            handleClose();
          }}
        >
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Edit Book
        </MenuItem>

        {/* Duplicate */}
        <MenuItem
          onClick={() => handleDuplicate(selectedBook)}
          disabled={duplicateLoading}
        >
          {duplicateLoading ? (
            <CircularProgress size={18} />
          ) : (
            <>
              <ContentCopyIcon sx={{ mr: 1, fontSize: 18 }} />
              Duplicate
            </>
          )}
        </MenuItem>
        {/* Publish / Unpublish */}
        <MenuItem
          onClick={() => handleTogglePublish(selectedBook)}
          sx={{
            color: selectedBook?.status === "Published" ? "#555" : "#2e7d32",
          }}
        >
          {selectedBook?.status === "Published" ? (
            <>
              <CancelIcon sx={{ mr: 1, fontSize: 18 }} />
              Draft
            </>
          ) : (
            <>
              <PublishIcon sx={{ mr: 1, fontSize: 18 }} />
              Publish
            </>
          )}
        </MenuItem>
        {/* Delete */}
        <MenuItem
          onClick={() => {
            setSelectedBookId(selectedBook.id);
            setDeleteDialogOpen(true);
            handleClose();
          }}
          sx={{ color: "#d32f2f" }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Delete Book
        </MenuItem>
      </Menu>
    </Box>
  );
}
function StatCard({ title, value, change, changeColor, icon, color }) {
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "14px",
        p: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* LEFT */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Icon Circle */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: color,
          }}
        >
          {icon}
        </Box>

        {/* Text */}
        <Box>
          <Typography sx={{ fontSize: 12, color: "#7a869a" }}>
            {title}
          </Typography>

          {/* VALUE */}
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 700,
              color: "#111",
              mt: 0.5,
            }}
          >
            {value}
          </Typography>

          {/* CHANGE ROW */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Box
              sx={{
                fontSize: 12,
                fontWeight: 600,
                px: 1,
                py: 0.3,
                borderRadius: "10px",
                backgroundColor:
                  changeColor === "green"
                    ? "rgba(46,125,50,0.1)"
                    : "rgba(211,47,47,0.1)",
                color: changeColor === "green" ? "#2e7d32" : "#d32f2f",
              }}
            >
              {change}
            </Box>

            <Typography sx={{ fontSize: 11, color: "#9aa5b1" }}>
              from last month
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
