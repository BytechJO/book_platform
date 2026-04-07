import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Button,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  TableContainer,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as XLSX from "xlsx";
import { useGetCodes, useGetBooks } from "src/api";
import { Helmet } from "react-helmet-async";
import axiosInstance from "src/api/axios";
import ENDPOINTS from "src/api/endpoints";
import DownloadButtonIcon from "src/components/icons/DownloadButtonIcon";
import { useRef } from "react";
import { LoadingButton } from "@mui/lab";
import SiteLoader from "../../components/SiteLoade";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function roleLabel(role) {
  if (!role) return "—";
  const r = role.toLowerCase();
  if (r === "student") return "Student";
  if (r === "teacher") return "Teacher";
  if (r === "admin") return "Admin";
  return role;
}

export default function Codes() {
  const { codes = [], loading, error, refetch } = useGetCodes();
  const { books = [] } = useGetBooks();
  const [search, setSearch] = useState("");
  const [bookId, setBookId] = useState("all");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importedCodes, setImportedCodes] = useState([]);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [importPreviewOpen, setImportPreviewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [newValidity, setNewValidity] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState(currentYear);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (codes || []).filter((c) => {
      const matchesSearch =
        !q ||
        String(c.code || "")
          .toLowerCase()
          .includes(q) ||
        String(c.book_title || "")
          .toLowerCase()
          .includes(q);

      const matchesBook =
        bookId === "all" || String(c.book_id) === String(bookId);

      const matchesRole =
        role === "all" || String(c.allowed_role || "").toLowerCase() === role;

      const isUsed = c.is_used === true;

      const matchesStatus =
        status === "all" ? true : status === "used" ? isUsed : !isUsed;
      const matchesYear =
        year === "all"
          ? true
          : new Date(c.created_at).getFullYear().toString() === year;
      return (
        matchesSearch &&
        matchesBook &&
        matchesRole &&
        matchesStatus &&
        matchesYear
      );
    });
  }, [search, codes, bookId, role, status, year]);

  const handleExportExcel = () => {
    const data = filtered.map((c) => ({
      "Book Name": c.book_title || "—",
      Code: c.code,
      "Validity (Months)": c.validity_months,
      Role: roleLabel(c.allowed_role),
      Status: c.is_used ? "Used" : "Unused",
      Created: formatDate(c.created_at),
      Used: c.used_at ? formatDate(c.used_at) : "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Codes");
    XLSX.writeFile(workbook, "codes.xlsx");
  };

  const handleGenerateCodes = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const number_of_codes = Number(formData.get("number_of_codes")) || 1;
    const allowed_role = formData.get("allowed_role");
    const validity_months = Number(formData.get("validity_months"));
    const book_id = formData.get("book_id");

    try {
      setGenerateLoading(true);
      const res = await axiosInstance.post(ENDPOINTS.Codes.Create, {
        number_of_codes,
        allowed_role,
        validity_months,
        book_id,
      });
      setGeneratedCodes(res.data.codes);
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setImportLoading(true);
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const parseDate = (dateStr) => {
          if (!dateStr || dateStr === "—") return null;
          const [day, month, year] = dateStr.split("/");
          return new Date(`${year}-${month}-${day}`);
        };

        const formattedCodes = jsonData.map((row) => {
          const bookName = row["Book Name"]?.trim();
          const matchedBook = books.find(
            (b) => b.title.toLowerCase() === bookName?.toLowerCase(),
          );
          const codeValue = row.Code?.trim();
          const isDuplicate = codes.some(
            (existing) =>
              existing.code?.toLowerCase() === codeValue?.toLowerCase(),
          );

          return {
            code: codeValue,
            validity_months: Number(row["Validity (Months)"]) || 0,
            allowed_role: row.Role?.toLowerCase(),
            is_used: row.Status === "Used",
            created_at: new Date(),
            used_at: parseDate(row.Used),
            book_id: matchedBook?.id || null,
            isDuplicate,
          };
        });
        setImportedCodes(formattedCodes);
        setImportPreviewOpen(true);
      } catch (error) {
        console.log(error);
      } finally {
        setImportLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleChangeImportedBook = (index, bookId) => {
    const updated = [...importedCodes];
    updated[index].book_id = bookId;
    setImportedCodes(updated);
  };

  const handleConfirmImport = async () => {
    try {
      setImportLoading(true);
      await axiosInstance.post(ENDPOINTS.Codes.Import, {
        codes: importedCodes,
      });
      await refetch();
      setImportPreviewOpen(false);
      setSnackbar({
        open: true,
        message: "Codes imported successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to import codes",
        severity: "error",
      });
    } finally {
      setImportLoading(false);
    }
  };

  const handleDownloadGenerated = () => {
    if (!generatedCodes.length) return;
    const data = generatedCodes.map((c) => {
      const book = books.find((b) => b.id === c.book_id);
      return {
        "Book Name": book?.title || "—",
        Code: c.code,
        "Validity (Months)": c.validity_months,
        Role: roleLabel(c.allowed_role),
        Status: c.is_used ? "Used" : "Unused",
        Created: formatDate(c.created_at),
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Generated Codes");
    XLSX.writeFile(workbook, "generated_codes.xlsx");
  };
  const handleEdit = (code) => {
    setSelectedCode(code);
    setNewValidity(code.validity_months);
    setEditOpen(true);
  };
  const handleUpdate = async () => {
    try {
      await axiosInstance.put(ENDPOINTS.Codes.UPDATE(selectedCode.id), {
        validity_months: Number(newValidity),
      });

      await refetch();
      setEditOpen(false);

      setSnackbar({
        open: true,
        message: "Code updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update code",
        severity: "error",
      });
    }
  };
  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };
  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(ENDPOINTS.Codes.DELETE(deleteId));

      await refetch();
      setDeleteOpen(false);

      setSnackbar({
        open: true,
        message: "Code deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete code",
        severity: "error",
      });
    }
  };
  if (loading) return <SiteLoader fullScreen text="Loading Books..." />;

  return (
    <>
      <Helmet>
        <title>Codes - Admin Dashboard</title>
      </Helmet>
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, // عمودي على الموبايل، أفقي على التابلت
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 2.5,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 22, md: 28 },
              fontWeight: 500,
              color: "#2d5aa7",
            }}
          >
            All codes
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              variant="contained"
              fullWidth={false}
              sx={{
                height: 36,
                px: 2,
                borderRadius: "4px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: { xs: 13, md: 15 },
                backgroundColor: "#FFFFFF",
                color: "#2B5A9E",
              }}
              onClick={() => fileInputRef.current.click()}
            >
              Import
            </Button>
            <input
              type="file"
              accept=".xlsx, .xls"
              hidden
              ref={fileInputRef}
              onChange={handleImportExcel}
            />

            <Button
              variant="contained"
              sx={{
                height: 36,
                px: 2,
                borderRadius: "4px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: { xs: 13, md: 15 },
                backgroundColor: "#2B5A9E",
              }}
              onClick={() => {
                setGeneratedCodes([]);
                setOpenDialog(true);
              }}
            >
              Generate
            </Button>
            <IconButton onClick={handleExportExcel} sx={{ p: 0 }}>
              <DownloadButtonIcon size={36} />
            </IconButton>
          </Stack>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            display: "grid",
            // تعديل الشبكة: 1 عمود في الموبايل، 2 في التابلت الصغير، 3 في المتوسط، 5 في الكبير
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
              lg: "1fr 1fr 1fr 1fr 1fr",
            },
            gap: 2,
            mb: 2.5,
            alignItems: "end",
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Search:
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search"
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
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Book
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {books.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Status
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="used">Used</MenuItem>
                <MenuItem value="unused">Unused</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Role
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="student">Students</MenuItem>
                <MenuItem value="teacher">Teachers</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Year
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={year} onChange={(e) => setYear(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
                <MenuItem value="2026">2026</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* ================= DESKTOP TABLE (يختفي على الموبايل والتابلت) ================= */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <TableContainer
            sx={{ backgroundColor: "transparent", boxShadow: "none" }}
          >
            <Table
              sx={{
                width: "100%",
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
              <TableHead>
                <TableRow sx={{ borderBottom: "2px solid #e0e0e0" }}>
                  <TableCell sx={{ color: "#7a869a", fontSize: 16 }}>
                    Book
                  </TableCell>
                  <TableCell sx={{ color: "#7a869a", fontSize: 16 }}>
                    Code
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#7a869a", fontSize: 16 }}
                  >
                    Validity (Months)
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#7a869a", fontSize: 16 }}
                  >
                    Role
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#7a869a", fontSize: 16 }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#7a869a", fontSize: 16 }}
                  >
                    Created
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#7a869a", fontSize: 16 }}
                  >
                    Used
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {error && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{ py: 4, textAlign: "center", color: "red" }}
                    >
                      Failed to load codes
                    </TableCell>
                  </TableRow>
                )}
                {!error && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ py: 4, textAlign: "center" }}>
                      No codes found
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    sx={{ "&:hover": { backgroundColor: "#f9fafc" } }}
                  >
                    <TableCell
                      sx={{
                        fontSize: 16,
                        color: "#333333",
                      }}
                    >
                      {c.book_title || "—"}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 16,
                        color: "#333333",
                      }}
                    >
                      {c.code}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: "#0073D8", fontWeight: 400, fontSize: 16 }}
                    >
                      {c.validity_months}
                    </TableCell>
                    <TableCell align="center">
                      {roleLabel(c.allowed_role)}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: c.is_used ? "#2e7d32" : "#d32f2f",
                        }}
                      >
                        {c.is_used ? "Used" : "Unused"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#7a869a" }}>
                      {formatDate(c.created_at)}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "#7a869a" }}>
                      {c.used_at ? formatDate(c.used_at) : "—"}
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <IconButton
                          onClick={() => handleEdit(c)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => handleDelete(c.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* ================= MOBILE CARDS (يظهر فقط على الموبايل والتابلت) ================= */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          {error && (
            <Typography sx={{ p: 4, textAlign: "center", color: "red" }}>
              Failed to load codes
            </Typography>
          )}
          {!error && filtered.length === 0 && (
            <Typography sx={{ p: 4, textAlign: "center" }}>
              No codes found
            </Typography>
          )}

          <Stack spacing={2}>
            {filtered.map((c) => (
              <Card
                key={c.id}
                variant="outlined"
                sx={{ borderRadius: 2, p: 1 }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  {/* Top Row: Book & Status */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "#2d5aa7",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.book_title || "—"}
                    </Typography>
                    <Chip
                      label={c.is_used ? "Used" : "Unused"}
                      size="small"
                      sx={{
                        color: "#fff",
                        backgroundColor: c.is_used ? "#2e7d32" : "#d32f2f",
                        ml: 1,
                      }}
                    />
                  </Box>
                  {/* Code */}
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, mb: 2, letterSpacing: 1 }}
                  >
                    {c.code}
                  </Typography>
                  {/* Details Grid */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1,
                      bgcolor: "#f9fafc",
                      p: 1.5,
                      borderRadius: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Validity
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#0073D8", fontWeight: 500 }}
                      >
                        {c.validity_months} Mo
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Role
                      </Typography>
                      <Typography variant="body2">
                        {roleLabel(c.allowed_role)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Created
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(c.created_at)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Used
                      </Typography>
                      <Typography variant="body2">
                        {c.used_at ? formatDate(c.used_at) : "—"}
                      </Typography>
                    </Box>
                  </Box>{" "}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(c)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(c.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* ================= DIALOGS ================= */}

        {/* Generate Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth={false}
          fullWidth
          PaperProps={{
            component: "form",
            onSubmit: handleGenerateCodes,
            sx: {
              width: 540,
              borderRadius: "30px",
              p: 3,
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              fontWeight: 600,
              color: "#2d5aa7",
              fontSize: 20,
            }}
          >
            Generate Activation Codes
          </DialogTitle>

          <DialogContent sx={{ mt: 2 }}>
            <Stack spacing={3}>
              {/* Number of Codes */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    mb: 1,
                    color: "#7A869A",
                  }}
                >
                  Number of Codes *
                </Typography>

                <TextField
                  name="number_of_codes"
                  fullWidth
                  placeholder="Enter number of codes"
                  InputProps={{
                    sx: {
                      height: 56,
                      borderRadius: "12px",
                      backgroundColor: "#F9FBFF",
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    mb: 1,
                    color: "#7A869A",
                  }}
                >
                  Book name *
                </Typography>

                <FormControl fullWidth>
                  <Select
                    name="book_id"
                    required
                    defaultValue=""
                    displayEmpty
                    sx={{
                      height: 56,
                      borderRadius: "12px",
                      backgroundColor: "#F9FBFF",
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select book
                    </MenuItem>

                    {books.map((b) => (
                      <MenuItem key={b.id} value={b.id}>
                        {b.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {/* Role */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    mb: 1,
                    color: "#7A869A",
                  }}
                >
                  Role *
                </Typography>

                <FormControl fullWidth>
                  <Select
                    name="allowed_role"
                    defaultValue="teacher"
                    displayEmpty
                    sx={{
                      height: 56,
                      borderRadius: "12px",
                      backgroundColor: "#F9FBFF",
                    }}
                  >
                    <MenuItem value="teacher">Teacher</MenuItem>
                    <MenuItem value="student">Student</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Validity */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    mb: 1,
                    color: "#7A869A",
                  }}
                >
                  Validity Duration (Months) *
                </Typography>

                <TextField
                  name="validity_months"
                  type="number"
                  required
                  fullWidth
                  placeholder="Enter number of months"
                  inputProps={{ min: 1 }}
                  InputProps={{
                    sx: {
                      height: 56,
                      borderRadius: "12px",
                      backgroundColor: "#F9FBFF",
                    },
                  }}
                />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "center",
              gap: 3,
              pb: 5,
            }}
          >
            {/* Generate */}
            <LoadingButton
              type="submit"
              loading={generateLoading}
              loadingPosition="center"
              variant="contained"
              sx={{
                width: 126,
                height: 59,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 16,
                backgroundColor: "#ECECEC",
                color: "#2B5A9E",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#DCDCDC",
                  boxShadow: "none",
                },
              }}
              disabled={generatedCodes.length > 0}
            >
              Generate
            </LoadingButton>

            {/* Cancel */}
            <Button
              onClick={() => setOpenDialog(false)}
              variant="contained"
              sx={{
                width: 126,
                height: 59,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 16,
                backgroundColor: "#466FAA",
                color: "#FFFFFF",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#3D6399",
                  boxShadow: "none",
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
          {generatedCodes.length > 0 && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography sx={{ mb: 1, color: "#7A869A" }}>
                Codes generated successfully. If you want, you can download
                them.
              </Typography>

              <Button
                variant="outlined"
                onClick={handleDownloadGenerated}
                disabled={generateLoading}
              >
                Download Generated Codes
              </Button>
            </Box>
          )}
        </Dialog>
        {/* Import Preview Dialog */}
        <Dialog
          open={importPreviewOpen}
          onClose={() => setImportPreviewOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Review Imported Codes</DialogTitle>
          <DialogContent>
            {/* تم إضافة TableContainer لمنع كسر التصميم عند وجود أعمدة كبيرة */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Book</TableCell>
                    <TableCell>Validity</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {importedCodes.map((c, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: c.isDuplicate ? "#ffe6e6" : "inherit",
                      }}
                    >
                      <TableCell>
                        <Typography
                          sx={{
                            color: c.isDuplicate ? "red" : "inherit",
                            fontWeight: c.isDuplicate ? 600 : 400,
                            fontSize: 14,
                          }}
                        >
                          {c.code}
                        </Typography>
                        {c.isDuplicate && (
                          <Typography variant="caption" sx={{ color: "red" }}>
                            Duplicate
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {c.book_id ? (
                          books.find((b) => b.id === c.book_id)?.title
                        ) : (
                          <FormControl fullWidth size="small">
                            <Select
                              value={c.book_id || ""}
                              onChange={(e) =>
                                handleChangeImportedBook(index, e.target.value)
                              }
                              displayEmpty
                            >
                              <MenuItem value="" disabled>
                                Select Book
                              </MenuItem>
                              {books.map((b) => (
                                <MenuItem key={b.id} value={b.id}>
                                  {b.title}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </TableCell>
                      <TableCell>{c.validity_months}</TableCell>
                      <TableCell>{c.allowed_role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions
            sx={{ p: 2, flexDirection: { xs: "column", sm: "row" }, gap: 1 }}
          >
            <Button onClick={() => setImportPreviewOpen(false)} fullWidth>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmImport}
              disabled={importedCodes.some((c) => !c.book_id)}
              fullWidth
            >
              Confirm Import
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
          <DialogTitle>Edit Code</DialogTitle>

          <DialogContent>
            <Typography sx={{ mb: 2 }}>Code: {selectedCode?.code}</Typography>

            <TextField
              fullWidth
              type="number"
              label="Validity (Months)"
              value={newValidity}
              onChange={(e) => setNewValidity(e.target.value)}
              inputProps={{ min: 1 }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>

          <DialogContent>
            <Typography>Are you sure you want to delete this code?</Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Backdrop
        open={importLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
