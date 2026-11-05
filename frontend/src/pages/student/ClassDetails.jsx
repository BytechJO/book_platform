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

const formatDate = (value, withTime = false) =>
  value
    ? dayjs(value).format(withTime ? "DD MMM YYYY, h:mm A" : "DD MMM YYYY")
    : "—";
const isEventEnded = (event) =>
  dayjs(
    `${dayjs(event.date).format("YYYY-MM-DD")}T${String(event.time || "00:00:00").slice(0, 8)}`,
  ).isBefore(dayjs());

export default function ClassDetails() {
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
        <Alert severity="error">Class details could not be loaded.</Alert>
      </Box>
    );
  }

  const classInfo = details.class;

  return (
    <Box sx={{ width: "92%", maxWidth: 1180, mx: "auto", py: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/student/classes")}
        sx={{ mb: 2, color: "#64748b" }}
      >
        Back to classes
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
          spacing={2.5}
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
            <Stack direction="row" spacing={1} alignItems="center">
              <SchoolOutlinedIcon />
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Teacher
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
          Joined {formatDate(classInfo.joined_at)}
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
            border: "1px solid #e2e8f0",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ p: 2.5, borderBottom: "1px solid #e2e8f0" }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                color: "#4f46e5",
                bgcolor: "#eef2ff",
              }}
            >
              <CampaignOutlinedIcon fontSize="small" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={800}>Notes & announcements</Typography>
              <Typography variant="caption" color="text.secondary">
                General updates published by your teacher
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
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Note</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Published</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.notes.slice(0, visibleNotes).map((note) => (
                  <TableRow key={note.id} hover sx={{ bgcolor: note.is_pinned ? "#fffbeb" : "inherit", "&:hover": { bgcolor: note.is_pinned ? "#fef3c7 !important" : undefined } }}>
                    <TableCell>
                      <Stack direction="row" spacing={0.7} alignItems="center"><Typography variant="body2" fontWeight={700}>{note.title}</Typography>{note.is_pinned && <Chip size="small" icon={<PushPinIcon />} label="Pinned" color="warning" variant="outlined" />}</Stack>
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
                      No notes have been published yet.
                    </TableCell>
                  </TableRow>
                )}
                {visibleNotes < details.notes.length && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Button size="small" onClick={() => setVisibleNotes(details.notes.length)}>Show more</Button>
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
            border: "1px solid #e2e8f0",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ p: 2.5, borderBottom: "1px solid #e2e8f0" }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                color: "#0284c7",
                bgcolor: "#e0f2fe",
              }}
            >
              <EventOutlinedIcon fontSize="small" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={800}>Class events</Typography>
              <Typography variant="caption" color="text.secondary">
                Scheduled events for this class
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
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
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
                      bgcolor: event.is_pinned ? "#fffbeb" : "inherit",
                      "&:hover": {
                        bgcolor: event.is_pinned
                          ? "#fef3c7 !important"
                          : undefined,
                      },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={0.7} alignItems="center">
                        <Typography variant="body2" fontWeight={700}>
                          {event.subject || "No subject"}
                        </Typography>
                        {event.is_pinned && (
                          <PushPinIcon sx={{ fontSize: 16, color: "#d97706" }} />
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
                        label={isEventEnded(event) ? "Ended" : "Upcoming"}
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
                      No events are scheduled for this class.
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
                        Show more
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
