import { useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import SlideshowOutlinedIcon from "@mui/icons-material/SlideshowOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import FolderZipOutlinedIcon from "@mui/icons-material/FolderZipOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import {
  createClassResource,
  deleteClassResource,
  downloadClassResource,
  updateClassResource,
} from "../api/Classes";

const EMPTY_FORM = {
  resource_type: "file",
  title: "",
  description: "",
  resource_url: "",
  file: null,
};

const typeDetails = {
  file: {
    label: "File",
    icon: <AttachFileIcon />,
    color: "#4f46e5",
    background: "rgba(79,70,229,0.12)",
  },
  worksheet: {
    label: "Worksheet",
    icon: <DescriptionOutlinedIcon />,
    color: "#4f46e5",
    background: "rgba(79,70,229,0.12)",
  },
  video: {
    label: "Video",
    icon: <OndemandVideoOutlinedIcon />,
    color: "#dc2626",
    background: "rgba(220,38,38,0.10)",
  },
  link: {
    label: "Link",
    icon: <LinkOutlinedIcon />,
    color: "#0284c7",
    background: "rgba(2,132,199,0.12)",
  },
};

const getResourceDetails = (resource) => {
  if (!["file", "worksheet"].includes(resource.resource_type)) {
    return typeDetails[resource.resource_type] || typeDetails.link;
  }

  const fileName = String(resource.original_file_name || "").toLowerCase();
  const mimeType = String(resource.mime_type || "").toLowerCase();
  const extension = fileName.includes(".") ? fileName.split(".").pop() : "";

  if (extension === "pdf" || mimeType === "application/pdf") {
    return {
      label: "PDF",
      icon: <PictureAsPdfOutlinedIcon />,
      color: "#dc2626",
      background: "rgba(220,38,38,0.10)",
    };
  }
  if (["doc", "docx"].includes(extension) || mimeType.includes("word")) {
    return {
      label: "Word",
      icon: <ArticleOutlinedIcon />,
      color: "#2563eb",
      background: "rgba(37,99,235,0.10)",
    };
  }
  if (
    ["xls", "xlsx"].includes(extension) ||
    mimeType.includes("excel") ||
    mimeType.includes("spreadsheet")
  ) {
    return {
      label: "Excel",
      icon: <TableChartOutlinedIcon />,
      color: "#15803d",
      background: "rgba(21,128,61,0.10)",
    };
  }
  if (
    ["ppt", "pptx"].includes(extension) ||
    mimeType.includes("powerpoint") ||
    mimeType.includes("presentation")
  ) {
    return {
      label: "PowerPoint",
      icon: <SlideshowOutlinedIcon />,
      color: "#ea580c",
      background: "rgba(234,88,12,0.10)",
    };
  }
  if (
    ["jpg", "jpeg", "png", "webp"].includes(extension) ||
    mimeType.startsWith("image/")
  ) {
    return {
      label: "Image",
      icon: <ImageOutlinedIcon />,
      color: "#9333ea",
      background: "rgba(147,51,234,0.10)",
    };
  }
  if (extension === "zip" || mimeType.includes("zip")) {
    return {
      label: "ZIP",
      icon: <FolderZipOutlinedIcon />,
      color: "#ca8a04",
      background: "rgba(202,138,4,0.10)",
    };
  }
  if (extension === "txt" || mimeType === "text/plain") {
    return {
      label: "Text",
      icon: <ArticleOutlinedIcon />,
      color: "#64748b",
      background: "rgba(100,116,139,0.12)",
    };
  }

  return {
    label: resource.resource_type === "worksheet" ? "Worksheet" : "File",
    icon: <InsertDriveFileOutlinedIcon />,
    color: "#4f46e5",
    background: "rgba(79,70,229,0.12)",
  };
};

const formatFileSize = (bytes) => {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return null;
  if (value < 1024 * 1024) return `${Math.ceil(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ClassResourcesSection({
  classId,
  resources = [],
  editable = false,
}) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const openDialog = (resource = null) => {
    setEditingResource(resource);
    setForm(
      resource
        ? {
            resource_type: resource.resource_type,
            title: resource.title,
            description: resource.description || "",
            resource_url: ["video", "link"].includes(resource.resource_type)
              ? resource.resource_url
              : "",
            file: null,
          }
        : EMPTY_FORM,
    );
    setError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setEditingResource(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const saveResource = async () => {
    const isFileType = ["file", "worksheet"].includes(form.resource_type);
    if (!form.title.trim()) {
      setError("Resource title is required.");
      return;
    }
    const canKeepExistingFile =
      editingResource &&
      ["file", "worksheet"].includes(editingResource.resource_type) &&
      editingResource.resource_url;
    if (isFileType && !form.file && !canKeepExistingFile) {
      setError("Choose a file to upload.");
      return;
    }
    if (!isFileType && !/^https?:\/\//i.test(form.resource_url.trim())) {
      setError("Enter a valid link starting with http:// or https://.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      if (editingResource) {
        await updateClassResource(classId, editingResource.id, form);
      } else {
        await createClassResource(classId, form);
      }
      setDialogOpen(false);
      setEditingResource(null);
      setForm(EMPTY_FORM);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not save the resource.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeResource = async () => {
    if (!resourceToDelete) return;

    try {
      setDeleting(true);
      setError("");

      await deleteClassResource(classId, resourceToDelete.id);

      setDeleteDialogOpen(false);
      setResourceToDelete(null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not delete the resource.",
      );
    } finally {
      setDeleting(false);
    }
  };
  const downloadResource = async (resource) => {
    try {
      setError("");
      setDownloadingId(resource.id);
      await downloadClassResource(resource);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not download the file.",
      );
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
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
          <AttachFileIcon color="primary" />
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={800}>Class resources</Typography>
            <Typography variant="caption" color="text.secondary">
              Files, worksheets, videos and useful links
            </Typography>
          </Box>
          <Chip size="small" label={resources.length} />
          {editable && (
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => openDialog()}
            >
              Add resource
            </Button>
          )}
        </Stack>

        {error && !dialogOpen && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 1.5,
          }}
        >
          {resources.slice(0, visibleCount).map((resource) => {
            const details = getResourceDetails(resource);
            return (
              <Box
                key={resource.id}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2.5,
                  bgcolor: "action.hover",
                  minWidth: 0,
                }}
              >
                <Stack direction="row" spacing={1.2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      borderRadius: 2,
                      bgcolor: details.background,
                      color: details.color,
                      "& .MuiSvgIcon-root": { fontSize: 20 },
                    }}
                  >
                    {details.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={0.7} alignItems="center">
                      <Typography variant="body2" fontWeight={800} noWrap>
                        {resource.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={details.label}
                        variant="outlined"
                      />
                    </Stack>
                    {resource.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {resource.description}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ display: "block", mt: 0.8 }}
                    >
                      {resource.original_file_name ||
                        dayjs(resource.created_at).format("DD MMM YYYY")}
                      {formatFileSize(resource.file_size)
                        ? ` · ${formatFileSize(resource.file_size)}`
                        : ""}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.7} sx={{ mt: 1.5 }}>
                  {["file", "worksheet"].includes(resource.resource_type) ? (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => downloadResource(resource)}
                      disabled={downloadingId === resource.id}
                    >
                      {downloadingId === resource.id
                        ? "Downloading..."
                        : "Download"}
                    </Button>
                  ) : (
                    <Button
                      component="a"
                      href={resource.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      variant="outlined"
                      endIcon={<OpenInNewIcon />}
                    >
                      {resource.resource_type === "video"
                        ? "Watch"
                        : "Open link"}
                    </Button>
                  )}
                  {editable && (
                    <Box sx={{ ml: "auto !important" }}>
                      <IconButton
                        size="small"
                        onClick={() => openDialog(resource)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setResourceToDelete(resource);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Box>

        {!resources.length && (
          <Box sx={{ py: 5, textAlign: "center", color: "text.secondary" }}>
            <AttachFileIcon sx={{ fontSize: 34, color: "#cbd5e1" }} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              No resources have been shared yet.
            </Typography>
          </Box>
        )}
        {visibleCount < resources.length && (
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              size="small"
              onClick={() => setVisibleCount(resources.length)}
            >
              Show more
            </Button>
          </Box>
        )}
      </Paper>

      {editable && (
        <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle fontWeight={800}>
            {editingResource ? "Edit class resource" : "Add class resource"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Resource type</InputLabel>
                <Select
                  label="Resource type"
                  value={form.resource_type}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      resource_type: event.target.value,
                      file: null,
                      resource_url: "",
                    })
                  }
                >
                  <MenuItem value="file">File</MenuItem>
                  <MenuItem value="worksheet">Worksheet</MenuItem>
                  <MenuItem value="video">Video link</MenuItem>
                  <MenuItem value="link">External link</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Title"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                inputProps={{ maxLength: 255 }}
              />
              <TextField
                label="Description (optional)"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                multiline
                minRows={2}
              />
              {["file", "worksheet"].includes(form.resource_type) ? (
                <Box>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AttachFileIcon />}
                  >
                    Choose file
                    <input
                      hidden
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp,.txt,.zip"
                      onChange={(event) =>
                        setForm({
                          ...form,
                          file: event.target.files?.[0] || null,
                        })
                      }
                    />
                  </Button>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.8 }}
                  >
                    {form.file?.name ||
                      editingResource?.original_file_name ||
                      "Maximum size: 20MB"}
                  </Typography>
                </Box>
              ) : (
                <TextField
                  label={
                    form.resource_type === "video"
                      ? "Video URL"
                      : "Resource URL"
                  }
                  value={form.resource_url}
                  onChange={(event) =>
                    setForm({ ...form, resource_url: event.target.value })
                  }
                  placeholder="https://..."
                />
              )}
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={closeDialog} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={saveResource}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingResource
                  ? "Save changes"
                  : "Publish"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          if (deleting) return;
          setDeleteDialogOpen(false);
          setResourceToDelete(null);
        }}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Delete resource?</DialogTitle>

        <DialogContent>
          <Typography color="text.secondary" variant="body2">
            Are you sure you want to delete{" "}
            <Box
              component="span"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {resourceToDelete?.title}
            </Box>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            disabled={deleting}
            onClick={() => {
              setDeleteDialogOpen(false);
              setResourceToDelete(null);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            disabled={deleting}
            onClick={removeResource}
            startIcon={<DeleteOutlineIcon />}
          >
            {deleting ? "Deleting..." : "Delete resource"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
