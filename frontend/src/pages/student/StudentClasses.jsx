import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import { useGetStudentClasses } from "../../api/Classes";

export default function StudentClasses() {
  const { classes, loading } = useGetStudentClasses();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const classesPerPage = 8;

  const filteredClasses = useMemo(() => {
    if (!classes) return [];
    return classes.filter(
      (cls) =>
        cls.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.book_title?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [classes, searchTerm]);

  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);

  const paginatedClasses = useMemo(() => {
    const start = (page - 1) * classesPerPage;
    return filteredClasses.slice(start, start + classesPerPage);
  }, [filteredClasses, page]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={28} sx={{ color: "#6366f1" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "92%",
        mx: "auto",
        py: 3,
        maxWidth: 960,
      }}
    >
      {/* ── HEADER ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FolderOpenIcon sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.5px",
              }}
            >
              My Classes
            </Typography>
          </Box>
          <Typography
            sx={{
              mt: 0.5,
              ml: 6.3,
              color: "#94a3b8",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {classes?.length ?? 0} classes total
          </Typography>
        </Box>

        {/* SEARCH */}
        <TextField
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
              </InputAdornment>
            ),
            sx: {
              fontSize: 13,
              borderRadius: "10px",
            },
          }}
          sx={{
            width: 220,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              background: "#fff",
              border: "1px solid #e2e8f0",
              "&:hover": { borderColor: "#c7d2fe" },
              "&.Mui-focused": {
                borderColor: "#6366f1",
                boxShadow: "0 0 0 3px rgba(99,102,241,0.1)",
              },
            },
          }}
        />
      </Box>

      {/* ── LIST ── */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {/* list header */}
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "1px solid #f1f5f9",
            background: "#fafbfc",
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
          >
            Showing {paginatedClasses.length} of {filteredClasses.length}
          </Typography>
        </Box>

        {paginatedClasses.map((cls, idx) => (
          <Box key={cls.id}>
            <Box
              sx={{
                px: 2.5,
                py: 1.8,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                transition: "all 0.15s ease",

                "&:hover": {
                  background: "#f8f9ff",
                },
              }}
            >
              {/* thumbnail */}
              <Box
                component="img"
                src={cls.cover_image_url_short}
                alt={cls.book_title}
                sx={{
                  width: 44,
                  height: 56,
                  borderRadius: "8px",
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "1px solid #f1f5f9",
                }}
              />

              {/* info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1e293b",
                    lineHeight: 1.3,
                  }}
                >
                  {cls.class_name}
                </Typography>
                <Box
                  sx={{
                    mt: 0.4,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <AutoStoriesIcon sx={{ fontSize: 13, color: "#a5b4fc" }} />
                  <Typography
                    noWrap
                    sx={{
                      fontSize: 12,
                      color: "#94a3b8",
                      fontWeight: 500,
                    }}
                  >
                    {cls.book_title}
                  </Typography>
                </Box>
              </Box>

              {/* students chip */}
              <Chip
                icon={
                  <PeopleAltIcon
                    sx={{ fontSize: 14, color: "#6366f1 !important" }}
                  />
                }
                label={cls.total_students}
                size="small"
                sx={{
                  height: 28,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#4f46e5",
                  background: "#eef2ff",
                  border: "1px solid #e0e7ff",
                  borderRadius: "8px",
                  "& .MuiChip-icon": { ml: 0.5 },
                }}
              />

              {/* arrow */}
              <IconButton
                size="small"
                sx={{
                  color: "#cbd5e1",
                  transition: "0.15s",
                  "&:hover": {
                    color: "#6366f1",
                    background: "#eef2ff",
                  },
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            {idx < paginatedClasses.length - 1 && (
              <Divider sx={{ mx: 2.5, borderColor: "#f1f5f9" }} />
            )}
          </Box>
        ))}

        {/* EMPTY */}
        {paginatedClasses.length === 0 && (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <FolderOpenIcon sx={{ fontSize: 40, color: "#e2e8f0", mb: 1 }} />
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}
            >
              No classes found
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#cbd5e1", mt: 0.3 }}>
              Try adjusting your search
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            size="small"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: 12,
                fontWeight: 600,
                minWidth: 32,
                height: 32,
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                color: "#64748b",
                background: "#fff",

                "&:hover": {
                  borderColor: "#c7d2fe",
                  background: "#f8f9ff",
                },

                "&.Mui-selected": {
                  background: "#6366f1",
                  color: "#fff",
                  border: "1px solid #6366f1",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
