import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";

import { useGetStudentClassDetails } from "../../api/Classes";
import CurveLoader from "../../components/CurveLoader";
import ClassResourcesSection from "../../components/ClassResourcesSection";
import { useDashboardLanguage } from "../../contexts/dashboardLanguage";

const formatDate = (value, withTime = false) =>
  value
    ? dayjs(value).format(withTime ? "DD MMM YYYY, h:mm A" : "DD MMM YYYY")
    : "—";
const isEventEnded = (event) =>
  dayjs(
    `${dayjs(event.date).format("YYYY-MM-DD")}T${String(event.time || "00:00:00").slice(0, 8)}`,
  ).isBefore(dayjs());

export default function ClassDetails() {
  const { t } = useDashboardLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { details, loading, error } = useGetStudentClassDetails(id);
  const [visibleNotes, setVisibleNotes] = useState(5);
  const [visibleEvents, setVisibleEvents] = useState(5);

  if (loading) {
    return <CurveLoader />;
  }

  if (error || !details) {
    return (
      <Box sx={{ width: "92%", maxWidth: 1180, mx: "auto", py: 4 }}>
        <Alert severity="error">
          {t("Class details could not be loaded.")}
        </Alert>
      </Box>
    );
  }

  const classInfo = details.class;

  return (
    <Box sx={{ width: "92%", maxWidth: 1180, mx: "auto", py: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/student/classes")}
        sx={{ mb: 2, color: "text.secondary" }}
      >
        {t("Back to classes")}
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: 4,
          color: "white",
          background: "linear-gradient(135deg, #312e81, #6366f1)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            gap: 2,
          }}
          alignItems={{ sm: "center" }}
        >
          <Box
            component="img"
            src={classInfo.cover_image}
            alt={classInfo.book_title}
            sx={{
              width: 72,
              height: 92,
              objectFit: "cover",
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,.15)",
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={800}>
              {classInfo.class_name}
            </Typography>
            <Typography sx={{ opacity: 0.85, mt: 0.5 }}>
              {classInfo.book_title}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1.4,
              borderRadius: 2.5,
              bgcolor: "rgba(255,255,255,.14)",
            }}
          >
            <Stack
              direction="row"
              sx={{
                gap: 3,
              }}
              alignItems="center"
            >
              <SchoolOutlinedIcon />
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {t("Teacher")}
                </Typography>
                <Typography fontWeight={700}>
                  {classInfo.teacher_name}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 2, opacity: 0.75 }}
        >
          {t("Joined {date}", { date: formatDate(classInfo.joined_at) })}
        </Typography>
      </Paper>

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              p: 2.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                color: "#4f46e5",
                bgcolor: "rgba(79,70,229,0.12)",
              }}
            >
              <CampaignOutlinedIcon fontSize="small" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={800}>
                {t("Notes & announcements")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("General updates published by your teacher")}
              </Typography>
            </Box>
            <Chip
              size="small"
              label={details.notes.length}
              color="primary"
              variant="outlined"
            />
          </Stack>
          <TableContainer>
            <Table sx={{ minWidth: 520 }}>
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>{t("Title")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t("Note")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {t("Published")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.notes.slice(0, visibleNotes).map((note) => (
                  <TableRow
                    key={note.id}
                    hover
                    sx={{
                      bgcolor: note.is_pinned
                        ? "rgba(245,158,11,0.10)"
                        : "inherit",
                      "&:hover": {
                        bgcolor: note.is_pinned
                          ? "rgba(245,158,11,0.16) !important"
                          : undefined,
                      },
                    }}
                  >
                    <TableCell>
                      <Stack
                        direction="row"
                        sx={{
                          gap: 0.5,
                        }}
                        alignItems="center"
                      >
                        <Typography variant="body2" fontWeight={700}>
                          {note.title}
                        </Typography>
                        {note.is_pinned && (
                          <Chip
                            size="small"
                            icon={<PushPinIcon />}
                            label={t("Pinned")}
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ minWidth: 240, whiteSpace: "pre-wrap" }}>
                      {note.content}
                    </TableCell>
                    <TableCell>{formatDate(note.created_at, true)}</TableCell>
                  </TableRow>
                ))}
                {!details.notes.length && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ py: 5, color: "text.secondary" }}
                    >
                      {t("No notes have been published yet.")}
                    </TableCell>
                  </TableRow>
                )}
                {visibleNotes < details.notes.length && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Button
                        size="small"
                        onClick={() => setVisibleNotes(details.notes.length)}
                      >
                        {t("Show more")}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              p: 2.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                color: "#0284c7",
                bgcolor: "rgba(2,132,199,0.12)",
              }}
            >
              <EventOutlinedIcon fontSize="small" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={800}>{t("Class events")}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t("Scheduled events for this class")}
              </Typography>
            </Box>
            <Chip
              size="small"
              label={details.events.length}
              color="info"
              variant="outlined"
            />
          </Stack>
          <TableContainer>
            <Table sx={{ minWidth: 480 }}>
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>{t("Subject")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t("Date")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t("Time")}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t("Status")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.events.slice(0, visibleEvents).map((event) => (
                  <TableRow
                    key={event.id}
                    hover
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      navigate("/student/events", {
                        state: {
                          selectedDate: event.date,
                          selectedEventId: event.id,
                        },
                      })
                    }
                    onKeyDown={(keyboardEvent) => {
                      if (keyboardEvent.key === "Enter") {
                        navigate("/student/events", {
                          state: {
                            selectedDate: event.date,
                            selectedEventId: event.id,
                          },
                        });
                      }
                    }}
                    sx={{
                      cursor: "pointer",
                      bgcolor: event.is_pinned
                        ? "rgba(245,158,11,0.10)"
                        : "inherit",
                      "&:hover": {
                        bgcolor: event.is_pinned
                          ? "rgba(245,158,11,0.16) !important"
                          : undefined,
                      },
                    }}
                  >
                    <TableCell>
                      <Stack
                        direction="row"
                        sx={{
                          gap: 0.5,
                        }}
                        alignItems="center"
                      >
                        <Typography variant="body2" fontWeight={700}>
                          {event.subject || t("No subject")}
                        </Typography>
                        {event.is_pinned && (
                          <PushPinIcon
                            sx={{ fontSize: 16, color: "#d97706" }}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{formatDate(event.date)}</TableCell>
                    <TableCell>
                      {String(event.time || "").slice(0, 5) || "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={t(isEventEnded(event) ? "Ended" : "Upcoming")}
                        color={isEventEnded(event) ? "default" : "success"}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {!details.events.length && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ py: 5, color: "text.secondary" }}
                    >
                      {t("No events are scheduled for this class.")}
                    </TableCell>
                  </TableRow>
                )}
                {visibleEvents < details.events.length && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Button
                        size="small"
                        onClick={() => setVisibleEvents(details.events.length)}
                      >
                        {t("Show more")}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Box sx={{ mt: 3 }}>
        <ClassResourcesSection
          classId={id}
          resources={details.resources || []}
        />
      </Box>
    </Box>
  );
}
