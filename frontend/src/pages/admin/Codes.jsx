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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { useGetCodes, useGetBooks } from "src/api";
import { Helmet } from "react-helmet-async";

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
  const { codes = [], loading, error } = useGetCodes();
  const { books = [] } = useGetBooks();
  const [search, setSearch] = useState("");
  const [bookId, setBookId] = useState("all");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");

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
                backgroundColor: "#2d5aa7",
                textTransform: "none",
                borderRadius: 1.5,
                px: 2,
                "&:hover": { backgroundColor: "#244a86" },
              }}
              onClick={() => {
                alert("Generate Code (TODO)");
              }}
            >
              Generate Code
            </Button>

            <IconButton
              onClick={handleExportExcel}
              sx={{
                border: "1px solid #d6dbe6",
                borderRadius: 1.5,
                width: 40,
                height: 40,
              }}
            >
              <DownloadIcon />
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
            borderRadius: 2,
            border: "1px solid #e6eaf2",
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#7a869a", fontWeight: 500 }}>
                  Code
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: "#7a869a",
                    fontWeight: 500,
                  }}
                >
                  Validity (Months)
                </TableCell>
                <TableCell sx={{ color: "#7a869a", fontWeight: 500 }}>
                  Role
                </TableCell>
                <TableCell sx={{ color: "#7a869a", fontWeight: 500 }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: "#7a869a", fontWeight: 500 }}>
                  Created
                </TableCell>
                <TableCell sx={{ color: "#7a869a", fontWeight: 500 }}>
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
                  <TableRow key={c.id} hover>
                    <TableCell sx={{ fontFamily: "monospace" }}>
                      {c.code}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#0073D8",
                        fontWeight: 400,
                      }}
                    >
                      {c.validity_months}
                    </TableCell>
                    <TableCell>{roleLabel(c.allowed_role)}</TableCell>

                    {/* Status placeholder */}
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: c.is_used ? "#2e7d32" : "#d32f2f",
                        }}
                      >
                        {c.is_used ? "Used" : "Unused"}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ color: "#7a869a" }}>
                      {formatDate(c.created_at)}
                    </TableCell>

                    {/* Used placeholder */}
                    <TableCell sx={{ color: "#7a869a" }}>—</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </>
  );
}
