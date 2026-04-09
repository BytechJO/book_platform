/* eslint-disable react-hooks/static-components */
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Button,
  Badge,
  Chip,
  Drawer,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { countActiveFilters } from "src/utils/codesUtils";

export default function CodesFilter({
  search,
  setSearch,
  bookId,
  setBookId,
  status,
  setStatus,
  role,
  setRole,
  year,
  setYear,
  books,
  currentYear,
}) {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    search: "",
    bookId: "all",
    status: "all",
    role: "all",
    year: currentYear,
  });

  const activeFilterCount = countActiveFilters({
    search,
    bookId,
    status,
    role,
    year,
  });

  const openFilterDrawer = () => {
    setTempFilters({ search, bookId, status, role, year });
    setFilterDrawerOpen(true);
  };

  const applyFilters = () => {
    setSearch(tempFilters.search);
    setBookId(tempFilters.bookId);
    setStatus(tempFilters.status);
    setRole(tempFilters.role);
    setYear(tempFilters.year);
    setFilterDrawerOpen(false);
  };

  const resetTempFilters = () => {
    setTempFilters({
      search: "",
      bookId: "all",
      status: "all",
      role: "all",
      year: currentYear,
    });
  };

  const resetAllFilters = () => {
    setSearch("");
    setBookId("all");
    setStatus("all");
    setRole("all");
    setYear(currentYear);
  };

  const FilterField = ({ label, children }) => (
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: "#7a869a",
          fontWeight: 500,
          mb: 0.5,
          display: "block",
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );

  return (
    <>
      {/* ===================== MOBILE: Search + Filter Button ===================== */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          gap: 1.5,
          mb: 2,
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search codes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            sx: {
              height: 40,
              borderRadius: "10px",
              backgroundColor: "#F5F7FA",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            },
          }}
        />
        <Badge
          badgeContent={activeFilterCount}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              top: 4,
              right: 4,
              fontSize: 11,
              minWidth: 18,
              height: 18,
            },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={openFilterDrawer}
            sx={{
              height: 40,
              minWidth: 100,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 500,
              fontSize: 14,
              borderColor: "#E0E4EA",
              color: "#555B6E",
              backgroundColor: "#F5F7FA",
              "&:hover": {
                borderColor: "#2B5A9E",
                backgroundColor: "#EDF1F8",
              },
            }}
          >
            Filters
          </Button>
        </Badge>
      </Box>

      {/* شريط الفلاتر النشطة على الموبايل */}
      {activeFilterCount > 0 && (
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            gap: 1,
            mb: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {bookId !== "all" && (
            <Chip
              label={books.find((b) => b.id === bookId)?.title || "Book"}
              size="small"
              onDelete={() => setBookId("all")}
              sx={{
                backgroundColor: "#E8F0FE",
                color: "#2B5A9E",
                fontWeight: 500,
                "& .MuiChip-deleteIcon": { color: "#2B5A9E" },
              }}
            />
          )}
          {status !== "all" && (
            <Chip
              label={status === "used" ? "Used" : "Unused"}
              size="small"
              onDelete={() => setStatus("all")}
              sx={{
                backgroundColor: "#E8F0FE",
                color: "#2B5A9E",
                fontWeight: 500,
                "& .MuiChip-deleteIcon": { color: "#2B5A9E" },
              }}
            />
          )}
          {role !== "all" && (
            <Chip
              label={role === "student" ? "Students" : "Teachers"}
              size="small"
              onDelete={() => setRole("all")}
              sx={{
                backgroundColor: "#E8F0FE",
                color: "#2B5A9E",
                fontWeight: 500,
                "& .MuiChip-deleteIcon": { color: "#2B5A9E" },
              }}
            />
          )}
          {year !== currentYear && (
            <Chip
              label={`Year: ${year}`}
              size="small"
              onDelete={() => setYear(currentYear)}
              sx={{
                backgroundColor: "#E8F0FE",
                color: "#2B5A9E",
                fontWeight: 500,
                "& .MuiChip-deleteIcon": { color: "#2B5A9E" },
              }}
            />
          )}
          <Chip
            label="Clear all"
            size="small"
            onClick={resetAllFilters}
            sx={{
              backgroundColor: "transparent",
              color: "#d32f2f",
              fontWeight: 500,
              border: "1px solid #d32f2f",
              "&:hover": { backgroundColor: "#FFEBEE" },
            }}
          />
        </Box>
      )}

      {/* ===================== DESKTOP: Filters Grid ===================== */}
      <Box
        sx={{
          display: { xs: "none", md: "grid" },
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
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
            <Select value={bookId} onChange={(e) => setBookId(e.target.value)}>
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
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
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
              <MenuItem value={currentYear}>{currentYear}</MenuItem>{" "}
              <MenuItem value={(currentYear - 1).toString()}>
                {currentYear - 1}
              </MenuItem>
              <MenuItem value={(currentYear - 2).toString()}>
                {currentYear - 2}
              </MenuItem>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      <Drawer
        anchor="bottom"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "20px 20px 0 0",
            maxHeight: "85vh",
            overflow: "hidden",
          },
        }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {/* Handle bar */}
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: "#D1D5DB",
            mx: "auto",
            mt: 2,
            mb: 1,
          }}
        />

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 1.5,
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#1E293B" }}>
            Filters
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {countActiveFilters(tempFilters) > 0 && (
              <IconButton
                size="small"
                onClick={resetTempFilters}
                sx={{
                  color: "#7a869a",
                  "&:hover": { backgroundColor: "#F5F7FA" },
                }}
                title="Reset filters"
              >
                <RestartAltIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={() => setFilterDrawerOpen(false)}
              sx={{
                color: "#7a869a",
                "&:hover": { backgroundColor: "#F5F7FA" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#F0F0F0" }} />

        {/* Filter Fields */}
        <Box
          sx={{
            px: 3,
            py: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            overflowY: "auto",
            maxHeight: "calc(85vh - 140px)",
          }}
        >
          <FilterField label="Book">
            <FormControl fullWidth>
              <Select
                value={tempFilters.bookId}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, bookId: e.target.value })
                }
                sx={{
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "#F5F7FA",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value="all">All Books</MenuItem>
                {books.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FilterField>

          <FilterField label="Status">
            <FormControl fullWidth>
              <Select
                value={tempFilters.status}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, status: e.target.value })
                }
                sx={{
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "#F5F7FA",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="used">Used</MenuItem>
                <MenuItem value="unused">Unused</MenuItem>
              </Select>
            </FormControl>
          </FilterField>

          <FilterField label="Role">
            <FormControl fullWidth>
              <Select
                value={tempFilters.role}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, role: e.target.value })
                }
                sx={{
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "#F5F7FA",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="student">Students</MenuItem>
                <MenuItem value="teacher">Teachers</MenuItem>
              </Select>
            </FormControl>
          </FilterField>

          <FilterField label="Year">
            <FormControl fullWidth>
              <Select
                value={tempFilters.year}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, year: e.target.value })
                }
                sx={{
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "#F5F7FA",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value="all">All Years</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
                <MenuItem value="2026">2026</MenuItem>
              </Select>
            </FormControl>
          </FilterField>
        </Box>

        {/* Apply Button */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderTop: "1px solid #F0F0F0",
            backgroundColor: "#fff",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={applyFilters}
            sx={{
              height: 50,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: 16,
              backgroundColor: "#2B5A9E",
              boxShadow: "0 4px 12px rgba(43, 90, 158, 0.3)",
              "&:hover": {
                backgroundColor: "#234B85",
                boxShadow: "0 4px 12px rgba(43, 90, 158, 0.4)",
              },
            }}
          >
            Apply Filters
            {countActiveFilters(tempFilters) > 0 &&
              ` (${countActiveFilters(tempFilters)})`}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
