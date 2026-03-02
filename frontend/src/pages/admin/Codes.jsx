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
      return matchesSearch && matchesBook && matchesRole && matchesStatus;
    });
  }, [codes, search, bookId, role, status]);

  const handleExportExcel = () => {
    const data = filtered.map((c) => ({
      Code: c.code,
      "Validity (Months)": c.validity_months,
      Role: roleLabel(c.allowed_role),
      Status: c.is_used ? "Used" : "Unused",
      Created: formatDate(c.created_at),
      Used: c.used ? formatDate(c.used_at) : "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Codes");

    XLSX.writeFile(workbook, "codes.xlsx");
  };
  const handleGenerateCodes = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const number_of_codes = Number(formData.get("number_of_codes"));
    const allowed_role = formData.get("allowed_role");
    const validity_months = Number(formData.get("validity_months"));
    const book_id = formData.get("book_id");

    if (!number_of_codes || number_of_codes <= 0) return;

    try {
      setGenerateLoading(true);

      await axiosInstance.post(ENDPOINTS.Codes.Create, {
        number_of_codes,
        allowed_role,
        validity_months,
        book_id,
      });

      await refetch();
      setOpenDialog(false);
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

        const formattedCodes = jsonData.map((row) => ({
          code: row.Code?.trim(),
          validity_months: Number(row["Validity (Months)"]) || 0,
          allowed_role: row.Role?.toLowerCase(),
          is_used: row.Status === "Used",
          created_at: parseDate(row.Created) || new Date(),
          used_at: parseDate(row.Used),
        }));

        await axiosInstance.post(ENDPOINTS.Codes.Import, {
          codes: formattedCodes,
        });

        await refetch();

        setSnackbar({
          open: true,
          message: "Codes imported successfully ✅",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Failed to import codes ❌",
          severity: "error",
        });
      } finally {
        setImportLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };
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
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            mb: 2.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 500,
              color: "#2d5aa7",
            }}
          >
            All codes
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="contained"
              sx={{
                height: 36,
                px: 3,
                borderRadius: "4px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: 15,
                backgroundColor: "#FFFFFF",
                color: "#2B5A9E",
              }}
              onClick={() => fileInputRef.current.click()}
            >
              Import Code
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
                px: 3,
                borderRadius: "4px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: 15,
                backgroundColor: "#2B5A9E",
              }}
              onClick={() => setOpenDialog(true)}
            >
              Generate Code
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
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 1fr" },
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
        </Box>

        {/* Table */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            backgroundColor: "transparent",
            boxShadow: "none",
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
              <col style={{ width: "18%" }} /> {/* Book */}
              <col style={{ width: "20%" }} /> {/* Code */}
              <col style={{ width: "14%" }} /> {/* Validity */}
              <col style={{ width: "14%" }} /> {/* Role */}
              <col style={{ width: "14%" }} /> {/* Status */}
              <col style={{ width: "10%" }} /> {/* Created */}
              <col style={{ width: "10%" }} /> {/* Used */}
            </colgroup>
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
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 4, textAlign: "center" }}>
                    Loading...
                  </TableCell>
                </TableRow>
              )}

              {!loading && error && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ py: 4, textAlign: "center", color: "red" }}
                  >
                    Failed to load codes
                  </TableCell>
                </TableRow>
              )}

              {!loading && !error && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 4, textAlign: "center" }}>
                    No codes found
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                !error &&
                filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f9fafc",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontFamily: "Roboto",
                        fontSize: 16,
                        color: "#333333",
                      }}
                    >
                      {c.book_title || "—"}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Roboto",
                        fontSize: 16,
                        color: "#333333",
                      }}
                    >
                      {c.code}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#0073D8",
                        fontWeight: 400,
                        fontFamily: "Roboto",
                        fontSize: 16,
                      }}
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

                    {/* Used placeholder */}
                    <TableCell sx={{ color: "#7a869a" }}>—</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
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
        </Dialog>
      </Box>
      {/* Loading Overlay */}
      <Backdrop
        open={importLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Snackbar Notification */}
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
