import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Fade,
  Divider,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";
import SubjectRoundedIcon from "@mui/icons-material/SubjectRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { useLocation, useNavigate } from "react-router-dom";

import { useGetTeacherEvents } from "../../../api/events";
import ENDPOINTS from "../../../api/endpoints";
import axiosInstance from "../../../api/axios";
import { useDashboardLanguage } from "../../../contexts/dashboardLanguage";

function ServerDay(props) {
  const { events = [], day, outsideCurrentMonth, ...other } = props;

  const hasEvents = events.some(
    (e) => dayjs(e.date).format("YYYY-MM-DD") === day.format("YYYY-MM-DD"),
  );

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={hasEvents ? "" : 0}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          ...(hasEvents && {
            bgcolor: "rgba(99, 102, 241, 0.08)",
            fontWeight: 700,
            color: "primary.main",
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

function DetailRow({ icon, label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        py: 2,
        px: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.15s ease",
        "&:hover": {
          bgcolor: "action.hover",
          borderColor: "divider",
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2.5,
          bgcolor: "rgba(99,102,241,0.12)",
          border: "1px solid rgba(99, 102, 241, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "#6366f1",
          "& .MuiSvgIcon-root": {
            fontSize: 18,
          },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            mb: 0.3,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: "text.primary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

export default function ViewEvents() {
  const { language, t } = useDashboardLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { events, refetch } = useGetTeacherEvents();

  const [date, setDate] = useState(
    location.state?.selectedDate ? dayjs(location.state.selectedDate) : dayjs(),
  );
  const [selectedEventId, setSelectedEventId] = useState(
    location.state?.selectedEventId ?? null,
  );
  const routedEventId = location.state?.selectedEventId;
  const routedEventDate = location.state?.selectedDate;

  useEffect(() => {
    if (!routedEventId) return undefined;

    let active = true;

    const openRoutedEvent = async () => {
      try {
        await refetch();
      } catch (error) {
        console.error("Could not refresh events:", error);
      }

      if (active) {
        if (routedEventDate) setDate(dayjs(routedEventDate));
        setSelectedEventId(routedEventId);
      }
    };

    openRoutedEvent();

    return () => {
      active = false;
    };
    // The location key changes when another notification targets this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, routedEventDate, routedEventId]);

  const selectedEvents = events
    .filter(
      (e) => dayjs(e.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD"),
    )
    .sort((a, b) => a.time.localeCompare(b.time));

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const selectedEventEnded = selectedEvent
    ? dayjs(
        `${dayjs(selectedEvent.date).format("YYYY-MM-DD")}T${selectedEvent.time}`,
      ).isBefore(dayjs())
    : false;
  useEffect(() => {
    const dayEvents = events
      .filter(
        (e) => dayjs(e.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD"),
      )
      .sort((a, b) => a.time.localeCompare(b.time));

    const selectedEventIsOnThisDay = dayEvents.some(
      (event) => event.id === selectedEventId,
    );

    if (!selectedEventIsOnThisDay && dayEvents.length > 0) {
      setSelectedEventId(dayEvents[0].id);
    }
  }, [date, events, selectedEventId]);
  const totalMonthEvents = useMemo(() => {
    const month = date.format("YYYY-MM");
    return events.filter((e) => dayjs(e.date).format("YYYY-MM") === month)
      .length;
  }, [events, date]);

  // Auto-select first event when date changes
  const handleDateChange = (newDate) => {
    setDate(newDate);
    const dayEvents = events
      .filter(
        (e) =>
          dayjs(e.date).format("YYYY-MM-DD") === newDate.format("YYYY-MM-DD"),
      )
      .sort((a, b) => a.time.localeCompare(b.time));
    setSelectedEventId(dayEvents.length > 0 ? dayEvents[0].id : null);
  };

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
  };

  // Extract book name and class name from title (format: "Book - Class")
  const parseEventTitle = (title) => {
    if (!title) return { book: "", className: "" };
    const parts = title.split(" - ");
    return {
      book: parts[0]?.trim() || "",
      className: parts.slice(1).join(" - ").trim() || "",
    };
  };

  const calendarStyles = {
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
        bgcolor: "#2B5A9E",
        color: "#fff",
        fontWeight: 700,
        "&:hover": {
          bgcolor: "#2B5A9E",
        },
      },
    },
    "& .MuiPickersCalendarHeader-root": {
      "& .MuiTypography-root": {
        fontSize: 15,
        fontWeight: 700,
        color: "text.primary",
      },
      "& .MuiIconButton-root": {
        color: "#64748b",
        "&:hover": { bgcolor: "action.hover" },
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 1,
        px: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ maxWidth: 960, width: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 800,
                color: "primary.main",
                letterSpacing: "-0.5px",
              }}
            >
              {t("My Events")}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#94a3b8", mt: 0.5 }}>
              {t("View and manage your scheduled events")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() =>
                navigate("/teacher/events/create", {
                  state: { selectedDate: date.format("YYYY-MM-DD") },
                })
              }
              sx={{
                height: 36,
                borderRadius: 2.5,
                px: 2,
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "#2B5A9E",
              }}
            >
              {t("Add event")}
            </Button>
            <Chip
              icon={<CalendarTodayRoundedIcon sx={{ fontSize: 14 }} />}
              label={t("{count} this month", { count: totalMonthEvents })}
              size="small"
              sx={{
                fontSize: 12,
                fontWeight: 600,
                height: 32,
                px: 0.5,
                bgcolor: "rgba(99, 102, 241, 0.08)",
                color: "primary.main",
                border: "1px solid rgba(99, 102, 241, 0.15)",
                "& .MuiChip-icon": { color: "primary.main" },
              }}
            />
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            display: "flex",
            gap: 0,
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "background.paper",
            boxShadow: "0 0 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* Left Panel — Calendar + Events */}
          <Box
            sx={{
              width: 380,
              flexShrink: 0,
              borderRight: "1.5px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Calendar */}
            <Box sx={{ p: 3, pb: 2 }}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={language}
              >
                <DateCalendar
                  value={date}
                  onChange={handleDateChange}
                  slots={{ day: ServerDay }}
                  slotProps={{
                    day: { events },
                  }}
                  sx={calendarStyles}
                />
              </LocalizationProvider>
            </Box>

            <Divider sx={{ mx: 3 }} />

            {/* Events List */}
            <Box sx={{ flex: 1, p: 3, overflow: "auto", maxHeight: 340 }}>
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
                    color: "primary.main",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {date.format("MMM D, YYYY")}
                </Typography>
                <Chip
                  label={`${selectedEvents.length} ${
                    language === "ar"
                      ? selectedEvents.length === 1
                        ? t("event")
                        : t("events")
                      : selectedEvents.length === 1
                        ? "event"
                        : "events"
                  }`}
                  size="small"
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    height: 24,
                    bgcolor:
                      selectedEvents.length > 0
                        ? "rgba(99, 102, 241, 0.08)"
                        : "action.hover",
                    color: selectedEvents.length > 0 ? "#2B5A9E" : "#94a3b8",
                    border: "1px solid",
                    borderColor:
                      selectedEvents.length > 0
                        ? "rgba(99, 102, 241, 0.15)"
                        : "divider",
                  }}
                />
              </Box>

              {selectedEvents.length === 0 ? (
                <Fade in>
                  <Box sx={{ textAlign: "center", py: 4, px: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        bgcolor: "action.hover",
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
                      {t("No events scheduled")}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#cbd5e1",
                        mt: 0.5,
                      }}
                    >
                      {t("Select another date or create a new event")}
                    </Typography>
                  </Box>
                </Fade>
              ) : (
                <Fade in>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    {selectedEvents.map((event, index) => {
                      const isSelected = event.id === selectedEventId;
                      return (
                        <Box
                          key={event.id}
                          onClick={() => handleEventClick(event.id)}
                          sx={{
                            display: "flex",
                            gap: 2,
                            p: 2,
                            borderRadius: 3,
                            bgcolor: isSelected
                              ? "rgba(99, 102, 241, 0.06)"
                              : "#f8fafc",
                            border: "1.5px solid",
                            borderColor: isSelected
                              ? "rgba(99, 102, 241, 0.2)"
                              : "action.hover",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            "&:hover": {
                              bgcolor: isSelected
                                ? "rgba(99, 102, 241, 0.08)"
                                : "action.hover",
                              borderColor: isSelected
                                ? "rgba(99, 102, 241, 0.25)"
                                : "divider",
                              transform: "translateX(2px)",
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
                              bgcolor: isSelected
                                ? "rgba(99,102,241,0.12)"
                                : "action.hover",
                              border: "1px solid",
                              borderColor: isSelected
                                ? "rgba(99, 102, 241, 0.12)"
                                : "transparent",
                              alignSelf: "flex-start",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: isSelected ? "#2B5A9E" : "#475569",
                                lineHeight: 1.2,
                              }}
                            >
                              {dayjs(event.time, "HH:mm:ss").format("h")}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 9,
                                fontWeight: 600,
                                color: isSelected ? "#2B5A9E" : "#94a3b8",
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
                                fontWeight: isSelected ? 700 : 600,
                                color: isSelected
                                  ? "primary.main"
                                  : "text.primary",
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

                          {/* Selection indicator */}
                          {isSelected && (
                            <Box
                              sx={{
                                width: 6,
                                borderRadius: 3,
                                bgcolor: "#2B5A9E",
                                alignSelf: "stretch",
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Fade>
              )}
            </Box>
          </Box>

          {/* Right Panel — Event Details */}
          <Box
            sx={{
              flex: 1,
              p: 4,
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
            }}
          >
            {!selectedEvent ? (
              /* Empty State */
              <Fade in>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 4,
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 4,
                      bgcolor: "action.hover",
                      border: "2px dashed",
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      fontSize: 32,
                    }}
                  >
                    🔍
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#334155",
                      mb: 0.5,
                    }}
                  >
                    {t("Select an event")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#94a3b8",
                      maxWidth: 260,
                      lineHeight: 1.6,
                    }}
                  >
                    {t(
                      "Click on any event from the list to view its full details",
                    )}
                  </Typography>
                </Box>
              </Fade>
            ) : (
              <Fade in key={selectedEvent.id}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    animation: "fadeSlideIn 0.35s ease both",
                    "@keyframes fadeSlideIn": {
                      from: {
                        opacity: 0,
                        transform: "translateY(8px)",
                      },
                      to: {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                    },
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#94a3b8",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          mb: 0.5,
                        }}
                      >
                        {t("Event details")}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: "text.primary",
                          letterSpacing: "-0.3px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedEvent.title}
                      </Typography>
                    </Box>

                    {/* Action buttons */}
                    <Box sx={{ display: "flex", gap: 1, ml: 2, mt: 3 }}>
                      <Tooltip
                        title={
                          selectedEventEnded
                            ? t("Ended events cannot be edited")
                            : t("Edit event")
                        }
                        arrow
                      >
                        <span>
                          <IconButton
                            disabled={selectedEventEnded}
                            onClick={() =>
                              navigate("/teacher/events/create", {
                                state: {
                                  selectedDate: selectedEvent.date,
                                  editEvent: selectedEvent,
                                },
                              })
                            }
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2.5,
                              border: "1.5px solid",
                              borderColor: "divider",
                              bgcolor: "background.paper",
                              color: "#64748b",
                              transition: "all 0.15s ease",
                              "&:hover": {
                                bgcolor: "action.hover",
                                borderColor: "#cbd5e1",
                                color: "#475569",
                              },
                            }}
                          >
                            <EditCalendarRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title={t("Delete event")} arrow>
                        <IconButton
                          onClick={async () => {
                            await axiosInstance.delete(
                              ENDPOINTS.EVENTS.DELETE(selectedEvent.id),
                            );

                            await refetch();

                            const remainingEvents = selectedEvents.filter(
                              (e) => e.id !== selectedEvent.id,
                            );

                            setSelectedEventId(
                              remainingEvents.length > 0
                                ? remainingEvents[0].id
                                : null,
                            );
                          }}
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2.5,
                            border: "1.5px solid",
                            borderColor: "divider",
                            bgcolor: "background.paper",
                            color: "#64748b",
                            transition: "all 0.15s ease",
                            "&:hover": {
                              bgcolor: "rgba(239,68,68,0.10)",
                              borderColor: "rgba(239,68,68,0.25)",
                              color: "#ef4444",
                            },
                          }}
                        >
                          <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Details */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <DetailRow
                      icon={<ScheduleRoundedIcon />}
                      label={t("Time")}
                      value={dayjs(selectedEvent.time, "HH:mm:ss").format(
                        "h:mm A",
                      )}
                    />
                    <DetailRow
                      icon={<CalendarTodayRoundedIcon />}
                      label={t("Date")}
                      value={dayjs(selectedEvent.date).format(
                        "dddd, MMMM D, YYYY",
                      )}
                    />
                    <DetailRow
                      icon={<MenuBookRoundedIcon />}
                      label={t("Book")}
                      value={parseEventTitle(selectedEvent.title).book}
                    />
                    <DetailRow
                      icon={<ClassRoundedIcon />}
                      label={t("Class")}
                      value={parseEventTitle(selectedEvent.title).className}
                    />
                    <DetailRow
                      icon={<SubjectRoundedIcon />}
                      label={t("Subject")}
                      value={selectedEvent.subject}
                    />
                  </Box>

                  {/* Spacer */}
                  <Box sx={{ flex: 1 }} />
                </Box>
              </Fade>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
