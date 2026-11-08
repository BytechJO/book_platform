import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import QrCode2Icon from "@mui/icons-material/QrCode2";

import {
  createClassNote,
  deleteClassNote,
  setClassItemPinned,
  updateClassNote,
  useGetTeacherClassDetails,
} from "../../api/Classes";
import { getStudentProgress } from "../../data/defaultClassProgress";
import CurveLoader from "../../components/CurveLoader";
import ClassResourcesSection from "../../components/ClassResourcesSection";
import QrCodeDialog from "../../components/QrCodeDialog";
import { buildClassQrUrl } from "../../utils/qrCodes";

const formatDate = (value) =>
  value ? dayjs(value).format("DD MMM YYYY") : "—";
const isEventEnded = (event) =>
  dayjs(
    `${dayjs(event.date).format("YYYY-MM-DD")}T${String(event.time || "00:00:00").slice(0, 8)}`,
  ).isBefore(dayjs());

export default function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { details, loading, error } = useGetTeacherClassDetails(id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [visibleNotes, setVisibleNotes] = useState(5);
  const [visibleEvents, setVisibleEvents] = useState(5);
  const [qrOpen, setQrOpen] = useState(false);

  const averageProgress = useMemo(() => {
    if (!details?.students?.length) return 0;
    const total = details.students.reduce(
      (sum, student, index) => sum + getStudentProgress(student, index),
      0,
    );
    return Math.round(total / details.students.length);
  }, [details?.students]);

  const openNoteDialog = (note = null) => {
    setEditingNote(note);
    setForm(
      note
        ? { title: note.title, content: note.content }
        : { title: "", content: "" },
    );
    setFormError("");
    setDialogOpen(true);
  };

  const closeNoteDialog = () => {
    setDialogOpen(false);
    setEditingNote(null);
    setForm({ title: "", content: "" });
    setFormError("");
  };

  const saveNote = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setFormError("Title and note are required.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      if (editingNote) await updateClassNote(id, editingNote.id, form);
      else await createClassNote(id, form);
      setDialogOpen(false);
      setEditingNote(null);
      setForm({ title: "", content: "" });
    } catch (requestError) {
      setFormError(
        requestError.response?.data?.message || "Could not save the note.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeNote = async (noteId) => {
    if (!window.confirm("Delete this class note?")) return;
    try {
      await deleteClassNote(id, noteId);
    } catch (requestError) {
      setFormError(
        requestError.response?.data?.message || "Could not delete the note.",
      );
    }
  };

  const togglePinned = async (item) => {
    try {
      await setClassItemPinned(id, item.id, !item.is_pinned);
    } catch (requestError) {
      setFormError(
        requestError.response?.data?.message || "Could not update the pin.",
      );
    }
  };

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
        onClick={() => navigate("/teacher/classes")}
        sx={{ mb: 2, color: "#64748b" }}
      >
        Back to classes
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: 4,
          color: "white",
          background: "linear-gradient(135deg, #312e81, #6366f1)",
          overflow: "hidden",
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
              borderRadius: 2,
              objectFit: "cover",
              bgcolor: "rgba(255,255,255,.15)",
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={800}>
              {classInfo.class_name}
            </Typography>
            <Typography sx={{ opacity: 0.82, mt: 0.5 }}>
              {classInfo.book_title}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<QrCode2Icon />}
              onClick={() => setQrOpen(true)}
              sx={{
                alignSelf: "center",
                color: "white",
                borderColor: "rgba(255,255,255,.55)",
                textTransform: "none",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,.1)",
                },
              }}
            >
              Class QR
            </Button>
            <Box
              sx={{
                px: 2,
                py: 1.2,
                borderRadius: 2.5,
                bgcolor: "rgba(255,255,255,.14)",
                textAlign: "center",
              }}
            >
              <Typography variant="h5" fontWeight={800}>
                {classInfo.total_students}
              </Typography>
              <Typography variant="caption">Students</Typography>
            </Box>
            <Box
              sx={{
                px: 2,
                py: 1.2,
                borderRadius: 2.5,
                bgcolor: "rgba(255,255,255,.14)",
                textAlign: "center",
              }}
            >
              <Typography variant="h5" fontWeight={800}>
                {averageProgress}%
              </Typography>
              <Typography variant="caption">Avg. progress</Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <PeopleAltOutlinedIcon color="primary" />
            <Typography fontWeight={800}>Class students</Typography>
            <Chip
              size="small"
              label={details.students.length}
              sx={{ ml: "auto" }}
            />
          </Box>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Book expires</TableCell>
                  <TableCell>Activity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.students.map((student, index) => {
                  const progress = getStudentProgress(student, index);
                  const bookExpired =
                    Boolean(student.expires_at) &&
                    dayjs(student.expires_at).isBefore(dayjs());
                  return (
                    <TableRow key={student.id} hover>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.2}
                          alignItems="center"
                        >
                          <Avatar src={student.avatar_url}>
                            {student.full_name?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>
                              {student.full_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {student.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={student.status}
                          color={
                            student.status === "active" ? "success" : "default"
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ flex: 1, height: 7, borderRadius: 4 }}
                          />
                          <Typography variant="caption" fontWeight={700}>
                            {progress}%
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{formatDate(student.joined_at)}</TableCell>
                      <TableCell
                        sx={{
                          bgcolor: bookExpired
                            ? "rgba(239,68,68,0.10)"
                            : "transparent",
                          borderLeft: bookExpired
                            ? "3px solid #ef4444"
                            : undefined,
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.8}
                          alignItems="center"
                        >
                          <Typography
                            variant="body2"
                            fontWeight={bookExpired ? 700 : 400}
                            color={bookExpired ? "error.main" : "inherit"}
                          >
                            {formatDate(student.expires_at)}
                          </Typography>
                          {bookExpired && (
                            <Chip
                              size="small"
                              label="Expired"
                              color="error"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>{student.activity_count ?? 0}</TableCell>
                    </TableRow>
                  );
                })}
                {!details.students.length && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 6, color: "text.secondary" }}
                    >
                      No students have joined this class yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <NotesOutlinedIcon color="primary" />
              <Typography fontWeight={800}>Notes & announcements</Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => openNoteDialog()}
                sx={{ ml: "auto !important" }}
              >
                Add note
              </Button>
            </Stack>
            {formError && !dialogOpen && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            <Stack spacing={1.5}>
              {details.notes.slice(0, visibleNotes).map((note) => (
                <Box
                  key={note.id}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: note.is_pinned
                      ? "rgba(245,158,11,0.10)"
                      : "action.hover",
                    border: note.is_pinned ? "1px solid #fbbf24" : "1px solid",
                    borderColor: note.is_pinned ? "#fbbf24" : "divider",
                  }}
                >
                  <Stack direction="row" alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={0.7} alignItems="center">
                        <Typography fontWeight={750}>{note.title}</Typography>
                        {note.is_pinned && (
                          <Chip
                            size="small"
                            label="Pinned"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}
                      >
                        {note.content}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {formatDate(note.created_at)}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color={note.is_pinned ? "warning" : "default"}
                      onClick={() => togglePinned(note)}
                      title={note.is_pinned ? "Unpin note" : "Pin note"}
                    >
                      {note.is_pinned ? (
                        <PushPinIcon fontSize="small" />
                      ) : (
                        <PushPinOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openNoteDialog(note)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeNote(note.id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              ))}
              {!details.notes.length && (
                <Typography variant="body2" color="text.secondary">
                  No notes published yet.
                </Typography>
              )}
              {visibleNotes < details.notes.length && (
                <Button
                  size="small"
                  onClick={() => setVisibleNotes(details.notes.length)}
                >
                  Show more
                </Button>
              )}
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <EventOutlinedIcon color="primary" />
              <Typography fontWeight={800}>Class events</Typography>
              <Chip
                size="small"
                label={details.events.length}
                sx={{ ml: "auto !important" }}
              />
            </Stack>
            <Stack spacing={1.4}>
              {details.events.slice(0, visibleEvents).map((event) => (
                <Box
                  key={event.id}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    navigate("/teacher/events", {
                      state: {
                        selectedDate: event.date,
                        selectedEventId: event.id,
                      },
                    })
                  }
                  onKeyDown={(keyboardEvent) => {
                    if (keyboardEvent.key === "Enter")
                      navigate("/teacher/events", {
                        state: {
                          selectedDate: event.date,
                          selectedEventId: event.id,
                        },
                      });
                  }}
                  sx={{
                    p: 1.6,
                    cursor: "pointer",
                    borderRadius: 2.5,
                    bgcolor: event.is_pinned
                      ? "rgba(245,158,11,0.10)"
                      : "action.hover",
                    border: event.is_pinned ? "1px solid #fbbf24" : "1px solid",
                    borderColor: event.is_pinned ? "#fbbf24" : "divider",
                    transition: "0.15s",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(15,23,42,.08)",
                    },
                  }}
                >
                  <Stack direction="row" alignItems="flex-start" spacing={1}>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={0.7}>
                        <Typography variant="body2" fontWeight={750}>
                          {event.title}
                        </Typography>
                        {event.is_pinned && (
                          <Chip
                            size="small"
                            label="Pinned"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                        <Chip
                          size="small"
                          label={isEventEnded(event) ? "Ended" : "Upcoming"}
                          color={isEventEnded(event) ? "default" : "success"}
                          variant="outlined"
                        />
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.4 }}
                      >
                        {event.subject || "No details"}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {formatDate(event.date)} ·{" "}
                        {String(event.time || "").slice(0, 5)}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color={event.is_pinned ? "warning" : "default"}
                      onClick={(clickEvent) => {
                        clickEvent.stopPropagation();
                        togglePinned(event);
                      }}
                      title={event.is_pinned ? "Unpin event" : "Pin event"}
                    >
                      {event.is_pinned ? (
                        <PushPinIcon fontSize="small" />
                      ) : (
                        <PushPinOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Stack>
                </Box>
              ))}
              {!details.events.length && (
                <Typography variant="body2" color="text.secondary">
                  No class events yet.
                </Typography>
              )}
              {visibleEvents < details.events.length && (
                <Button
                  size="small"
                  onClick={() => setVisibleEvents(details.events.length)}
                >
                  Show more
                </Button>
              )}
            </Stack>
          </Paper>
        </Box>

        <ClassResourcesSection
          classId={id}
          resources={details.resources || []}
          editable
        />
      </Stack>

      <Dialog
        open={dialogOpen}
        onClose={closeNoteDialog}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: { overflowX: "hidden" },
          },
        }}
      >
        <DialogTitle fontWeight={800}>
          {editingNote ? "Edit class note" : "Publish a class note"}
        </DialogTitle>
        <DialogContent sx={{ overflowX: "hidden" }}>
          <Stack spacing={2} sx={{ mt: 1, width: "100%", minWidth: 0 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              inputProps={{ maxLength: 255 }}
              autoFocus
            />
            <TextField
              label="Note or announcement"
              value={form.content}
              onChange={(event) =>
                setForm({ ...form, content: event.target.value })
              }
              multiline
              minRows={4}
            />
            {formError && <Alert severity="error">{formError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={closeNoteDialog} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveNote} disabled={saving}>
            {saving ? "Saving..." : editingNote ? "Save changes" : "Publish"}
          </Button>
        </DialogActions>
      </Dialog>

      <QrCodeDialog
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        title={classInfo.class_name}
        subtitle={classInfo.book_title}
        code={classInfo.class_name}
        value={buildClassQrUrl(classInfo.book_id, classInfo.class_name)}
        fileName={`class-${classInfo.class_name}`}
      />
    </Box>
  );
}
