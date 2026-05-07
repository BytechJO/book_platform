import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Pagination,
  CircularProgress,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGetStudentActivities } from "../../api/studentActivities";

dayjs.extend(relativeTime);

export default function StudentActivities() {
  const { activities, loading } = useGetStudentActivities();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const activitiesPerPage = 10;

  const filteredActivities = useMemo(() => {
    if (!activities) return [];
    return activities.filter(
      (activity) =>
        activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activities, searchTerm]);

  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);

  const paginatedActivities = useMemo(() => {
    const start = (page - 1) * activitiesPerPage;
    return filteredActivities.slice(start, start + activitiesPerPage);
  }, [filteredActivities, page]);

  const getTypeConfig = (type) => {
    switch (type) {
      case "event":
        return {
          icon: <EventAvailableRoundedIcon sx={{ fontSize: 15 }} />,
          color: "#2563eb",
          bg: "#eff6ff",
          border: "#bfdbfe",
          label: "Event",
          dot: "#2563eb",
        };
      case "class":
        return {
          icon: <ClassRoundedIcon sx={{ fontSize: 15 }} />,
          color: "#7c3aed",
          bg: "#f5f3ff",
          border: "#ddd6fe",
          label: "Class",
          dot: "#7c3aed",
        };
      case "book":
        return {
          icon: <MenuBookRoundedIcon sx={{ fontSize: 15 }} />,
          color: "#059669",
          bg: "#ecfdf5",
          border: "#a7f3d0",
          label: "Book",
          dot: "#059669",
        };
      default:
        return {
          icon: <PersonRoundedIcon sx={{ fontSize: 15 }} />,
          color: "#64748b",
          bg: "#f8fafc",
          border: "#e2e8f0",
          label: "Activity",
          dot: "#64748b",
        };
    }
  };

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups = {};
    paginatedActivities.forEach((activity) => {
      const dateKey = dayjs(activity.created_at).format("YYYY-MM-DD");
      const dateLabel = dayjs(activity.created_at).format("MMMM D, YYYY");

      if (!groups[dateKey]) {
        groups[dateKey] = { label: dateLabel, items: [] };
      }
      groups[dateKey].items.push(activity);
    });
    return Object.entries(groups);
  }, [paginatedActivities]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <CircularProgress size={24} sx={{ color: "#2B5A9E" }} />
        <Typography sx={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
          Loading activities...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "94%",
        mx: "auto",
        py: 3,
        maxWidth: 780,
      }}
    >
      {/* ─── TOP BAR ─── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2B5A9E 0%, #1b4680 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(43,90,158,0.25)",
            }}
          >
            <HistoryRoundedIcon sx={{ color: "#fff", fontSize: 19 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.2,
                letterSpacing: "-0.3px",
              }}
            >
              Activities
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 500 }}>
              {activities?.length ?? 0} records
            </Typography>
          </Box>
        </Box>

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
                <SearchIcon sx={{ fontSize: 17, color: "#b0bec5" }} />
              </InputAdornment>
            ),
            sx: { fontSize: 13 },
          }}
          sx={{
            width: { xs: "100%", sm: 210 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "9px",
              background: "#fff",
              fontSize: 13,
              height: 36,
              "& fieldset": { borderColor: "#e8edf2", borderWidth: "1.5px" },
              "&:hover fieldset": { borderColor: "#c2cdd8" },
              "&.Mui-focused fieldset": { borderColor: "#2B5A9E", borderWidth: "1.5px" },
            },
          }}
        />
      </Box>

      {/* ─── ACTIVITIES LIST ─── */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "14px",
          border: "1.5px solid #f0f2f5",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        {groupedActivities.map(([dateKey, group], groupIdx) => (
          <Box key={dateKey}>
            {/* Date header */}
            <Box
              sx={{
                px: 2.5,
                py: 1.2,
                background: "#fafbfc",
                borderBottom: "1px solid #f0f2f5",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                {group.label}
              </Typography>
              <Chip
                label={group.items.length}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94a3b8",
                  background: "#f1f5f9",
                  borderRadius: "5px",
                }}
              />
            </Box>

            {/* Activity rows */}
            {group.items.map((activity, idx) => {
              const config = getTypeConfig(activity.type);
              const isLast = idx === group.items.length - 1;
              const isVeryLast = groupIdx === groupedActivities.length - 1 && isLast;

              return (
                <Box key={activity.id}>
                  <Box
                    sx={{
                      px: 2.5,
                      py: 1.6,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      transition: "background 0.15s ease",
                      cursor: "default",

                      "&:hover": { background: "#f8faff" },
                    }}
                  >
                    {/* Colored dot + timeline line */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexShrink: 0,
                        width: 20,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: config.dot,
                          flexShrink: 0,
                          mt: 0.3,
                        }}
                      />
                      {!isVeryLast && (
                        <Box
                          sx={{
                            width: 1.5,
                            flex: 1,
                            minHeight: 20,
                            background: "#f0f2f5",
                            mt: 0.5,
                          }}
                        />
                      )}
                    </Box>

                    {/* Icon badge */}
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        background: config.bg,
                        border: "1px solid",
                        borderColor: config.border,
                        color: config.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {config.icon}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1e293b",
                            lineHeight: 1.3,
                          }}
                        >
                          {activity.title}
                        </Typography>

                        <Chip
                          label={config.label}
                          size="small"
                          sx={{
                            height: 19,
                            fontSize: 9.5,
                            fontWeight: 700,
                            letterSpacing: "0.3px",
                            background: config.bg,
                            color: config.color,
                            borderRadius: "5px",
                            border: "1px solid",
                            borderColor: config.border,
                            flexShrink: 0,
                          }}
                        />
                      </Box>

                      <Typography
                        noWrap
                        sx={{
                          mt: 0.2,
                          fontSize: 12,
                          color: "#8896a7",
                          fontWeight: 500,
                          lineHeight: 1.4,
                        }}
                      >
                        {activity.description}
                      </Typography>
                    </Box>

                    {/* Time */}
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#b0bec5",
                        fontWeight: 500,
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dayjs(activity.created_at).format("h:mm A")}
                    </Typography>
                  </Box>

                  {!isVeryLast && <Divider sx={{ borderColor: "#f5f7f9" }} />}
                </Box>
              );
            })}
          </Box>
        ))}

        {/* EMPTY */}
        {paginatedActivities.length === 0 && (
          <Box sx={{ py: 10, textAlign: "center" }}>
            <HistoryRoundedIcon sx={{ fontSize: 36, color: "#e2e8f0", mb: 1 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>
              No activities found
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#cbd5e1", mt: 0.3 }}>
              Try adjusting your search
            </Typography>
          </Box>
        )}
      </Box>

      {/* ─── PAGINATION ─── */}
      {totalPages > 1 && (
        <Box sx={{ mt: 3, pb: 2, display: "flex", justifyContent: "center" }}>
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
                minWidth: 30,
                height: 30,
                borderRadius: "8px",
                border: "1.5px solid #eef0f4",
                color: "#64748b",
                background: "#fff",
                "&:hover": { borderColor: "#c7d2fe", background: "#fafbff" },
                "&.Mui-selected": {
                  background: "#2B5A9E",
                  color: "#fff",
                  border: "1.5px solid #2B5A9E",
                  boxShadow: "0 3px 8px rgba(43,90,158,0.25)",
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}