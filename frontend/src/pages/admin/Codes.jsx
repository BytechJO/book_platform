import { useMemo, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Stack,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";
import { useGetCodes, useGetBooks } from "src/api";
import { Helmet } from "react-helmet-async";
import DownloadButtonIcon from "src/components/icons/DownloadButtonIcon";
import CurveLoader from "../../components/CurveLoader";
import CodesFilter from "./CodesFilter";
import CodesDialogs from "./CodesDialogs";
import { formatDate, roleLabel } from "src/utils/codesUtils";

export default function Codes() {
  const { codes = [], loading, error, refetch } = useGetCodes();
  const { books = [] } = useGetBooks();

  // Filters State
  const [search, setSearch] = useState("");
  const [bookId, setBookId] = useState("all");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState(currentYear);

  // Dialogs State
  const [openDialog, setOpenDialog] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState([]);

  const fileInputRef = useRef(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importedCodes, setImportedCodes] = useState([]);
  const [importPreviewOpen, setImportPreviewOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [newValidity, setNewValidity] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  const handleEdit = (code) => {
    setSelectedCode(code);
    setNewValidity(code.validity_months);
    setEditOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  if (loading) return <CurveLoader />;

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
            flexDirection: { xs: "column", sm: "row" },
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

        {/* Filters Component (Desktop & Mobile) */}
        <CodesFilter
          search={search}
          setSearch={setSearch}
          bookId={bookId}
          setBookId={setBookId}
          status={status}
          setStatus={setStatus}
          role={role}
          setRole={setRole}
          year={year}
          setYear={setYear}
          books={books}
          currentYear={currentYear}
        />

        {/* ================= DESKTOP TABLE ================= */}
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
                    <TableCell sx={{ fontSize: 16, color: "#333333" }}>
                      {c.book_title || "—"}
                    </TableCell>
                    <TableCell sx={{ fontSize: 16, color: "#333333" }}>
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

        {/* ================= MOBILE CARDS ================= */}
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
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, mb: 2, letterSpacing: 1 }}
                  >
                    {c.code}
                  </Typography>
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
                  </Box>
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
      </Box>

      {/* All Dialogs Component */}
      <CodesDialogs
        books={books}
        refetch={refetch}
        setSnackbar={setSnackbar}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        generateLoading={generateLoading}
        setGenerateLoading={setGenerateLoading}
        generatedCodes={generatedCodes}
        setGeneratedCodes={setGeneratedCodes}
        importPreviewOpen={importPreviewOpen}
        setImportPreviewOpen={setImportPreviewOpen}
        importLoading={importLoading}
        setImportLoading={setImportLoading}
        importedCodes={importedCodes}
        setImportedCodes={setImportedCodes}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        selectedCode={selectedCode}
        newValidity={newValidity}
        setNewValidity={setNewValidity}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        deleteId={deleteId}
      />

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
