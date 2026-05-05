import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Fade,
  CircularProgress,
  Divider,
} from "@mui/material";

import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

import axiosInstance from "../../../api/axios";
import ENDPOINTS from "../../../api/endpoints";

import { useGetMyBooks } from "../../../api/user_books";
import { useGetClassesByBook } from "../../../api/Classes";
import { useGetTeacherEvents } from "../../../api/events";

function ServerDay(props) {
  const { events = [], day, outsideCurrentMonth, ...other } = props;

  const hasEvents = events.some(
    (e) => dayjs(e.date).format("YYYY-MM-DD") === day.format("YYYY-MM-DD"),
  );

  return (
    <Badge key={day.toString()} overlap="circular" badgeContent={hasEvents ? "" : 0}>
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          ...(hasEvents && {
            bgcolor: "rgba(99, 102, 241, 0.08)",
            fontWeight: 700,
            color: "#4338ca",
            "&:hover": {
              bgcolor: "rgba(99, 102, 241, 0.15)",
            },
          }),
        }}
      />
    </Badge>
  );
}

function Badge(props) {
  const { children, badgeContent, ...other } = props;
  const hasContent = typeof badgeContent === "string" && badgeContent !== "";

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }} {...other}>
      {children}
      {hasContent && (
        <Box
          sx={{
            position: "absolute",
            bottom: 2,
            left: "50%",
            transform: "translateX(-50%)",
            width: 5,
            height: 5,
            borderRadius: "50%",
            bgcolor: "#6366f1",
          }}
        />
      )}
    </Box>
  );
}

export default function CreateEvent() {
  const location = useLocation();
  const { events, refetch } = useGetTeacherEvents();
  const [date, setDate] = useState(
    location.state?.selectedDate ? dayjs(location.state.selectedDate) : dayjs(),
  );

  const { books } = useGetMyBooks();

  const [selectedBook, setSelectedBook] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const selectedEvents = events
    .filter(
      (e) =>
        dayjs(e.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD"),
    )
    .sort((a, b) => a.time.localeCompare(b.time));

  const { classes, loading: classesLoading } =
    useGetClassesByBook(selectedBook);

  const [time, setTime] = useState({
    hour: "10",
    minute: "00",
    period: "AM",
  });

  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const hours = useMemo(
    () => Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
    [],
  );

  const minutes = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")),
    [],
  );

  useEffect(() => {
    if (classes.length > 0) {
      setSelectedClass(classes[0].id);
    } else {
      setSelectedClass("");
    }
  }, [classes]);

  const handleCreate = async () => {
    if (!selectedClass || !selectedBook) return;

    try {
      setLoading(true);
      const book = books.find((b) => b.id === selectedBook);
      const cls = classes.find((c) => c.id === selectedClass);
      const title = `${book?.title || ""} - ${cls?.class_name || ""}`;

      let formattedHour = parseInt(time.hour);
      if (time.period === "PM" && formattedHour !== 12) formattedHour += 12;
      if (time.period === "AM" && formattedHour === 12) formattedHour = 0;

      const finalTime = `${formattedHour
        .toString()
        .padStart(2, "0")}:${time.minute}:00`;

      await axiosInstance.post(ENDPOINTS.EVENTS.CREATE, {
        title,
        subject,
        date: date.format("YYYY-MM-DD"),
        time: finalTime,
      });
      refetch();
      setOpen(true);

      setSelectedBook("");
      setSelectedClass("");
      setSubject("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      bgcolor: "#fff",
      transition: "all 0.2s ease",
      border: "1.5px solid #e2e8f0",
      "&:hover": {
        border: "1.5px solid #cbd5e1",
        bgcolor: "#fafbfc",
      },
      "&.Mui-focused": {
        border: "1.5px solid #6366f1",
        bgcolor: "#fff",
        boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
      },
      "&.Mui-disabled": {
        bgcolor: "#f1f5f9",
        color: "#94a3b8",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#64748b",
      fontSize: 14,
      "&.Mui-focused": {
        color: "#6366f1",
      },
    },
  };

  const textFieldStyles = {
    ...selectStyles,
    "& .MuiOutlinedInput-root": {
      ...selectStyles["& .MuiOutlinedInput-root"],
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        py: 5,
        px: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ maxWidth: 960, width: "100%" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.5px",
            }}
          >
            Create Event
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#94a3b8", mt: 0.5 }}>
            Schedule a new event for your classes
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            display: "flex",
            gap: 0,
            borderRadius: 4,
            overflow: "hidden",
            border: "1.5px solid #e2e8f0",
            bgcolor: "#fff",
          }}
        >
          {/* Left Panel — Calendar + Events */}
          <Box
            sx={{
              width: 380,
              flexShrink: 0,
              borderRight: "1.5px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Calendar */}
            <Box sx={{ p: 3, pb: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={date}
                  onChange={setDate}
                  slots={{ day: ServerDay }}
                  slotProps={{
                    day: { events },
                  }}
                  sx={{
                    "& .MuiPickersCalendar-root": {
                      gap: 0.5,
                    },
                    "& .MuiDayCalendar-weekDayLabel": {
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    },
                    "& .MuiPickersDay-root": {
                      fontSize: 13,
                      fontWeight: 500,
                      borderRadius: 2,
                      width: 36,
                      height: 36,
                      "&.Mui-selected": {
                        bgcolor: "#6366f1",
                        color: "#fff",
                        fontWeight: 700,
                        "&:hover": {
                          bgcolor: "#4f46e5",
                        },
                      },
                    },
                    "& .MuiPickersCalendarHeader-root": {
                      "& .MuiTypography-root": {
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#0f172a",
                      },
                      "& .MuiIconButton-root": {
                        color: "#64748b",
                        "&:hover": { bgcolor: "#f1f5f9" },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            <Divider sx={{ mx: 3, borderColor: "#f1f5f9" }} />

            {/* Events List */}
            <Box sx={{ flex: 1, p: 3, overflow: "auto", maxHeight: 300 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {date.format("MMM D, YYYY")}
                </Typography>
                <Chip
                  label={`${selectedEvents.length} event${selectedEvents.length !== 1 ? "s" : ""}`}
                  size="small"
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    height: 24,
                    bgcolor: selectedEvents.length > 0
                      ? "rgba(99, 102, 241, 0.08)"
                      : "#f1f5f9",
                    color: selectedEvents.length > 0
                      ? "#6366f1"
                      : "#94a3b8",
                    border: "1px solid",
                    borderColor: selectedEvents.length > 0
                      ? "rgba(99, 102, 241, 0.15)"
                      : "#e2e8f0",
                  }}
                />
              </Box>

              {selectedEvents.length === 0 ? (
                <Fade in>
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 4,
                      px: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        bgcolor: "#f8fafc",
                        border: "1.5px dashed #cbd5e1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                        fontSize: 20,
                      }}
                    >
                      📅
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#94a3b8",
                        fontWeight: 500,
                      }}
                    >
                      No events scheduled
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#cbd5e1",
                        mt: 0.5,
                      }}
                    >
                      Create one using the form
                    </Typography>
                  </Box>
                </Fade>
              ) : (
                <Fade in>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {selectedEvents.map((event, index) => (
                      <Box
                        key={event.id}
                        sx={{
                          display: "flex",
                          gap: 2,
                          p: 2,
                          borderRadius: 3,
                          bgcolor: "#f8fafc",
                          border: "1px solid #f1f5f9",
                          transition: "all 0.15s ease",
                          "&:hover": {
                            bgcolor: "#f1f5f9",
                            borderColor: "#e2e8f0",
                          },
                          animation: `slideIn 0.3s ease ${index * 0.05}s both`,
                          "@keyframes slideIn": {
                            from: {
                              opacity: 0,
                              transform: "translateY(6px)",
                            },
                            to: {
                              opacity: 1,
                              transform: "translateY(0)",
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            minWidth: 52,
                            textAlign: "center",
                            py: 0.5,
                            px: 1,
                            borderRadius: 2,
                            bgcolor: "#eef2ff",
                            border: "1px solid rgba(99, 102, 241, 0.08)",
                            alignSelf: "flex-start",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#4338ca",
                              lineHeight: 1.2,
                            }}
                          >
                            {dayjs(event.time, "HH:mm:ss").format("h")}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 9,
                              fontWeight: 600,
                              color: "#6366f1",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {dayjs(event.time, "HH:mm:ss").format("mm A")}
                          </Typography>
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#1e293b",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {event.title}
                          </Typography>
                          {event.subject && (
                            <Typography
                              sx={{
                                fontSize: 11,
                                color: "#94a3b8",
                                mt: 0.3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {event.subject}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Fade>
              )}
            </Box>
          </Box>

          {/* Right Panel — Form */}
          <Box
            sx={{
              flex: 1,
              p: 4,
              display: "flex",
              flexDirection: "column",
              bgcolor: "#fff",
            }}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 700,
                color: "#0f172a",
                mb: 0.5,
              }}
            >
              Event Details
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: "#94a3b8",
                mb: 3.5,
              }}
            >
              Fill in the information below to schedule
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                flex: 1,
              }}
            >
              {/* Book Select */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#475569",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <span style={{ color: "#6366f1" }}>●</span> Book
                </Typography>
                <FormControl fullWidth sx={selectStyles}>
                  <InputLabel>Select a book</InputLabel>
                  <Select
                    value={selectedBook}
                    label="Select a book"
                    onChange={(e) => {
                      setSelectedBook(e.target.value);
                      setSelectedClass("");
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          mt: 0.5,
                          borderRadius: 3,
                          border: "1.5px solid #e2e8f0",
                          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                          "& .MuiMenuItem-root": {
                            fontSize: 13,
                            py: 1.2,
                            borderRadius: 2,
                            mx: 1,
                            "&.Mui-selected": {
                              bgcolor: "rgba(99, 102, 241, 0.08)",
                              fontWeight: 600,
                              color: "#4338ca",
                            },
                            "&:hover": {
                              bgcolor: "#f8fafc",
                            },
                          },
                        },
                      },
                    }}
                  >
                    {books.map((book) => (
                      <MenuItem key={book.id} value={book.id}>
                        {book.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Class Select */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#475569",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <span style={{ color: "#6366f1" }}>●</span> Class
                </Typography>
                <FormControl
                  fullWidth
                  sx={selectStyles}
                  disabled={!selectedBook || classesLoading}
                >
                  <InputLabel>
                    {classesLoading
                      ? "Loading..."
                      : !selectedBook
                        ? "Select a book first"
                        : "Select a class"}
                  </InputLabel>
                  <Select
                    value={selectedClass}
                    label={
                      classesLoading
                        ? "Loading..."
                        : !selectedBook
                          ? "Select a book first"
                          : "Select a class"
                    }
                    onChange={(e) => setSelectedClass(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          mt: 0.5,
                          borderRadius: 3,
                          border: "1.5px solid #e2e8f0",
                          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                          "& .MuiMenuItem-root": {
                            fontSize: 13,
                            py: 1.2,
                            borderRadius: 2,
                            mx: 1,
                            "&.Mui-selected": {
                              bgcolor: "rgba(99, 102, 241, 0.08)",
                              fontWeight: 600,
                              color: "#4338ca",
                            },
                            "&:hover": {
                              bgcolor: "#f8fafc",
                            },
                          },
                        },
                      },
                    }}
                  >
                    {classesLoading ? (
                      <MenuItem disabled>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            py: 0.5,
                          }}
                        >
                          <CircularProgress size={14} />
                          <span>Loading classes...</span>
                        </Box>
                      </MenuItem>
                    ) : (
                      classes.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.class_name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Box>

              {/* Subject */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#475569",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <span style={{ color: "#6366f1" }}>●</span> Subject{" "}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 11,
                      color: "#cbd5e1",
                      fontWeight: 400,
                    }}
                  >
                    (optional)
                  </Typography>
                </Typography>
                <TextField
                  placeholder="e.g. Chapter 5 Review"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  fullWidth
                  sx={textFieldStyles}
                />
              </Box>

              {/* Time */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#475569",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <span style={{ color: "#6366f1" }}>●</span> Time
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <FormControl fullWidth sx={selectStyles}>
                    <InputLabel>Hour</InputLabel>
                    <Select
                      value={time.hour}
                      label="Hour"
                      onChange={(e) => setTime({ ...time, hour: e.target.value })}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 0.5,
                            borderRadius: 3,
                            border: "1.5px solid #e2e8f0",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                            maxHeight: 240,
                            "& .MuiMenuItem-root": {
                              fontSize: 13,
                              py: 0.8,
                              justifyContent: "center",
                              borderRadius: 1.5,
                              mx: 1,
                              "&.Mui-selected": {
                                bgcolor: "rgba(99, 102, 241, 0.08)",
                                fontWeight: 700,
                                color: "#4338ca",
                              },
                            },
                          },
                        },
                      }}
                    >
                      {hours.map((h) => (
                        <MenuItem key={h} value={h}>
                          {h}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={selectStyles}>
                    <InputLabel>Min</InputLabel>
                    <Select
                      value={time.minute}
                      label="Min"
                      onChange={(e) =>
                        setTime({ ...time, minute: e.target.value })
                      }
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 0.5,
                            borderRadius: 3,
                            border: "1.5px solid #e2e8f0",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                            maxHeight: 240,
                            "& .MuiMenuItem-root": {
                              fontSize: 13,
                              py: 0.8,
                              justifyContent: "center",
                              borderRadius: 1.5,
                              mx: 1,
                              "&.Mui-selected": {
                                bgcolor: "rgba(99, 102, 241, 0.08)",
                                fontWeight: 700,
                                color: "#4338ca",
                              },
                            },
                          },
                        },
                      }}
                    >
                      {minutes.map((m) => (
                        <MenuItem key={m} value={m}>
                          {m}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={selectStyles}>
                    <InputLabel>AM/PM</InputLabel>
                    <Select
                      value={time.period}
                      label="AM/PM"
                      onChange={(e) =>
                        setTime({ ...time, period: e.target.value })
                      }
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            mt: 0.5,
                            borderRadius: 3,
                            border: "1.5px solid #e2e8f0",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                            "& .MuiMenuItem-root": {
                              fontSize: 13,
                              fontWeight: 600,
                              py: 1,
                              justifyContent: "center",
                              borderRadius: 2,
                              mx: 1,
                              "&.Mui-selected": {
                                bgcolor: "rgba(99, 102, 241, 0.08)",
                                color: "#4338ca",
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="AM">AM</MenuItem>
                      <MenuItem value="PM">PM</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Spacer */}
              <Box sx={{ flex: 1 }} />

              {/* Submit Button */}
              <Button
                variant="contained"
                onClick={handleCreate}
                disabled={!selectedClass || loading}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                  textTransform: "none",
                  bgcolor: "#6366f1",
                  color: "#fff",
                  boxShadow: "none",
                  border: "1.5px solid #6366f1",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#4f46e5",
                    borderColor: "#4f46e5",
                    boxShadow: "0 4px 16px rgba(99, 102, 241, 0.35)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "none",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#f1f5f9",
                    borderColor: "#e2e8f0",
                    color: "#94a3b8",
                  },
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <CircularProgress size={16} sx={{ color: "inherit" }} />
                    Creating...
                  </Box>
                ) : (
                  "Create Event"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{
            borderRadius: 3,
            fontSize: 13,
            fontWeight: 600,
            px: 3,
            py: 1.5,
            border: "1.5px solid rgba(34, 197, 94, 0.15)",
            boxShadow: "0 8px 30px rgba(34, 197, 94, 0.15)",
            "& .MuiAlert-icon": {
              fontSize: 20,
            },
          }}
        >
          Event created successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}