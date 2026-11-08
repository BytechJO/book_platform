import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import ENDPOINTS from "../../../api/endpoints";
import { Helmet } from "react-helmet-async";
import ImageUploadBox from "../../../components/ImageUploadBox";
import { useGetBooks } from "../../../api";
import { useGetCategories } from "../../../api/categories";
import CurveLoader from "../../../components/CurveLoader";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
export default function CreateBook() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shortImage, setShortImage] = useState(null);
  const [longImage, setLongImage] = useState(null);
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [shortPreview, setShortPreview] = useState(null);
  const [longPreview, setLongPreview] = useState(null);
  const { books } = useGetBooks();
  const { categories } = useGetCategories();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      setCategoryLoading(true);

      const res = await axiosInstance.post(ENDPOINTS.CATEGORIES.CREATE, {
        name: newCategory,
      });

      const created = res.data;

      // 🔥 تحديث القائمة
      categories.push(created);

      // 🔥 اختاره مباشرة
      setValue("category_id", created.id);

      setNewCategory("");
      setCategoryDialogOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCategoryLoading(false);
    }
  };
  const schema = yup.object().shape({
    title: yup
      .string()
      .trim()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),

    description: yup.string().nullable(),
    short_description: yup.string().nullable(),

    app_store_url: yup.string().nullable().url("Invalid App Store URL"),

    google_play_url: yup.string().nullable().url("Invalid Google Play URL"),

    online_book_url: yup.string().nullable().url("Invalid Online Book URL"),
    // category: yup.string().required("Category is required"),
    short_image: isEdit
      ? yup.mixed().nullable() // 🔥 هنا الحل
      : yup.mixed().required("Short cover image is required"),
    long_image: isEdit
      ? yup.mixed().nullable()
      : yup.mixed().required("Long cover image is required"),
  });

  useEffect(() => {
    if (isEdit && books.length > 0) {
      const book = books.find((b) => b.id === parseInt(id));

      if (book) {
        setValue("title", book.title || "");
        setValue("description", book.description || "");
        setValue("short_description", book.short_description || "");
        setValue("app_store_url", book.app_store_url || "");
        setValue("google_play_url", book.google_play_url || "");
        setValue("online_book_url", book.online_book_url || "");
        setValue("status", book.status || "Draft");
        setValue("language", book.language || "");
        setValue("category_id", book.category_id || "");
        setShortPreview(book.cover_image_url_short);
        setLongPreview(book.cover_image_url_long);
      } else {
        navigate("/admin/books");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, books, navigate, isEdit]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      short_description: "",
      app_store_url: "",
      google_play_url: "",
      online_book_url: "",
      status: "Draft",
      language: "",
      category_id: "",
      short_image: null,
      long_image: null,
    },
  });
  const handleImageChange = (file, type) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === "short") {
      setShortImage(file);
      setShortPreview(previewUrl);
      setValue("short_image", file);
    } else {
      setLongImage(file);
      setLongPreview(previewUrl);
      setValue("long_image", file);
    }
  };
  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "short_image" || key === "long_image") return;
      let value = data[key];

      // 🔥 أهم سطر
      if (key === "category_id" && value === "") {
        return; // ❌ لا تبعت الحقل نهائياً
      }

      formData.append(key, value?.trim?.() ?? value);
    });

    if (shortImage) formData.append("cover_short", shortImage);
    if (longImage) formData.append("cover_long", longImage);

    try {
      setLoading(true);

      if (isEdit) {
        await axiosInstance.put(ENDPOINTS.BOOKS.UPDATE(id), formData);
      } else {
        await axiosInstance.post(ENDPOINTS.BOOKS.CREATE, formData);
      }

      navigate("/admin/books");
    } catch (err) {
      const message = err.response?.data?.message;

      if (message === "Book title already exists") {
        setError("title", {
          type: "server",
          message: "This title already exists",
        });
      } else {
        console.log(message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <CurveLoader />;
  }
  return (
    <>
      <Helmet>
        {isEdit ? (
          <title>Edit Book - Admin Dashboard</title>
        ) : (
          <title>Create Book - Admin Dashboard</title>
        )}
      </Helmet>

      <Box sx={{ minHeight: "100vh", py: 4 }}>
        <Box sx={{ maxWidth: 1220, mx: "auto", px: { xs: 2, md: 3 } }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/admin/books")}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
              mb: 1.5,
              px: 0,
              "&:hover": { backgroundColor: "transparent", color: "primary.main" },
            }}
          >
            Back to books
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 28, md: 34 },
                  lineHeight: 1.2,
                  fontWeight: 750,
                  color: "primary.main",
                }}
              >
                {isEdit ? "Edit Book" : "Create New Book"}
              </Typography>
              <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: 14 }}>
                {isEdit
                  ? "Update the book information, links, and cover images."
                  : "Add book information, availability links, and cover images."}
              </Typography>
            </Box>

            <Chip
              label={watch("status") || "Draft"}
              sx={{
                px: 1,
                fontWeight: 700,
                color:
                  watch("status") === "Published"
                    ? "success.main"
                    : "warning.main",
                backgroundColor:
                  watch("status") === "Published"
                    ? "rgba(46,125,50,0.14)"
                    : "rgba(237,108,2,0.14)",
              }}
            />
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 360px" },
              gap: 3,
              alignItems: "start",
            }}
          >
            <Stack spacing={3}>
              <Box sx={sectionCardSx}>
                <SectionHeader
                  icon={<MenuBookRoundedIcon />}
                  title="Basic Information"
                  description="Enter the main information students will see about this book."
                />

                <Stack spacing={2.5}>
                  <Box>
                    <FieldLabel required>Book Title</FieldLabel>
                    <TextField
                      placeholder="Enter the book title"
                      {...register("title")}
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      fullWidth
                      sx={fieldSx}
                    />
                  </Box>

                  <Box>
                    <FieldLabel>Short Description</FieldLabel>
                    <TextField
                      placeholder="Write a short summary for book cards"
                      {...register("short_description")}
                      error={!!errors.short_description}
                      helperText={errors.short_description?.message}
                      multiline
                      rows={2}
                      fullWidth
                      sx={fieldSx}
                    />
                  </Box>

                  <Box>
                    <FieldLabel>Full Description</FieldLabel>
                    <TextField
                      placeholder="Describe the book, its content, and learning goals"
                      {...register("description")}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      multiline
                      rows={5}
                      fullWidth
                      sx={fieldSx}
                    />
                  </Box>
                </Stack>
              </Box>

              <Box sx={sectionCardSx}>
                <SectionHeader
                  icon={<CategoryRoundedIcon />}
                  title="Classification & Publishing"
                  description="Organize the book and control how it appears on the platform."
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 2.5,
                  }}
                >
                  <Box>
                    <FieldLabel>Category</FieldLabel>
                    <FormControl fullWidth sx={fieldSx}>
                      <Select
                        displayEmpty
                        value={watch("category_id")}
                        onChange={(e) => {
                          if (e.target.value === "add_new") {
                            setCategoryDialogOpen(true);
                            return;
                          }

                          setValue("category_id", e.target.value);
                        }}
                      >
                        <MenuItem value="">
                          <Typography color="text.secondary">Select category</Typography>
                        </MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                        <MenuItem
                          value="add_new"
                          sx={{ color: "primary.main", fontWeight: 700, gap: 1 }}
                        >
                          <AddRoundedIcon fontSize="small" /> Add Category
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <FieldLabel>Language</FieldLabel>
                    <FormControl fullWidth sx={fieldSx}>
                      <Select
                        displayEmpty
                        value={watch("language")}
                        onChange={(e) => setValue("language", e.target.value)}
                      >
                        <MenuItem value="">
                          <Typography color="text.secondary">Select language</Typography>
                        </MenuItem>
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Arabic">Arabic</MenuItem>
                        <MenuItem value="French">French</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
                    <FieldLabel>Status</FieldLabel>
                    <FormControl fullWidth sx={fieldSx}>
                      <Select
                        value={watch("status")}
                        onChange={(e) => setValue("status", e.target.value)}
                      >
                        <MenuItem value="Draft">Draft</MenuItem>
                        <MenuItem value="Published">Published</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography sx={{ mt: 1, color: "text.secondary", fontSize: 12 }}>
                      Draft books stay private. Published books appear in the public catalog.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={sectionCardSx}>
                <SectionHeader
                  icon={<LinkRoundedIcon />}
                  title="Availability Links"
                  description="Connect the book to its online and mobile versions."
                />

                <Stack spacing={2.5}>
                  <Box>
                    <FieldLabel>Online Book URL</FieldLabel>
                    <TextField
                      placeholder="https://example.com/read"
                      {...register("online_book_url")}
                      error={!!errors.online_book_url}
                      helperText={errors.online_book_url?.message}
                      fullWidth
                      sx={fieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkRoundedIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                      gap: 2.5,
                    }}
                  >
                    <Box>
                      <FieldLabel>Google Play URL</FieldLabel>
                      <TextField
                        placeholder="https://play.google.com/..."
                        {...register("google_play_url")}
                        error={!!errors.google_play_url}
                        helperText={errors.google_play_url?.message}
                        fullWidth
                        sx={fieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LinkRoundedIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Box>
                      <FieldLabel>App Store URL</FieldLabel>
                      <TextField
                        placeholder="https://apps.apple.com/..."
                        {...register("app_store_url")}
                        error={!!errors.app_store_url}
                        helperText={errors.app_store_url?.message}
                        fullWidth
                        sx={fieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LinkRoundedIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Stack>

            <Stack
              spacing={3}
              sx={{ position: { lg: "sticky" }, top: { lg: 92 }, alignSelf: "start" }}
            >
              <Box sx={sectionCardSx}>
                <SectionHeader
                  icon={<ImageRoundedIcon />}
                  title="Cover Images"
                  description="Upload the portrait and landscape covers."
                />

                <Stack spacing={3}>
                  <ImageUploadBox
                    label="Short Cover (3:4)"
                    preview={shortPreview}
                    onFileSelect={(file) => handleImageChange(file, "short")}
                  />
                  {errors.short_image && (
                    <Typography color="error" fontSize={13}>
                      {errors.short_image.message}
                    </Typography>
                  )}

                  <ImageUploadBox
                    label="Long Cover (16:9)"
                    preview={longPreview}
                    onFileSelect={(file) => handleImageChange(file, "long")}
                  />
                  {errors.long_image && (
                    <Typography color="error" fontSize={13}>
                      {errors.long_image.message}
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Box sx={sectionCardSx}>
                <SectionHeader
                  icon={<VisibilityRoundedIcon />}
                  title="Book Preview"
                  description="A quick preview of the catalog card."
                />

                <Box
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "background.paper",
                  }}
                >
                  <Box
                    sx={{
                      height: 190,
                      background: (theme) =>
                        theme.palette.mode === "dark"
                          ? "linear-gradient(135deg, #243b5a 0%, #1d2f49 100%)"
                          : "linear-gradient(135deg, #e8f0fe 0%, #dbeafe 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {shortPreview ? (
                      <Box
                        component="img"
                        src={shortPreview}
                        alt="Book cover preview"
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <MenuBookRoundedIcon sx={{ fontSize: 70, color: "primary.main" }} />
                    )}
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 750,
                        color: "text.primary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {watch("title") || "Book title"}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.75,
                        color: "text.secondary",
                        fontSize: 12,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: 36,
                      }}
                    >
                      {watch("short_description") ||
                        "The short description will appear here."}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}>
                      {watch("language") && (
                        <Chip label={watch("language")} size="small" />
                      )}
                      <Chip
                        label={watch("status") || "Draft"}
                        size="small"
                        sx={{
                          color:
                            watch("status") === "Published"
                              ? "success.main"
                              : "warning.main",
                          backgroundColor:
                            watch("status") === "Published"
                              ? "rgba(46,125,50,0.14)"
                              : "rgba(237,108,2,0.14)",
                        }}
                      />
                    </Stack>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ ...sectionCardSx, p: 2 }}>
                <Stack direction={{ xs: "column", sm: "row", lg: "column" }} spacing={1.5}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    sx={{
                      height: 48,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      backgroundColor: "primary.main",
                      "&:hover": { backgroundColor: "primary.dark" },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={22} sx={{ color: "white" }} />
                    ) : isEdit ? (
                      "Save Changes"
                    ) : (
                      "Create Book"
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate("/admin/books")}
                    sx={{
                      height: 46,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 650,
                      borderColor: "divider",
                      color: "text.secondary",
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>
        <Dialog
          open={categoryDialogOpen}
          onClose={() => setCategoryDialogOpen(false)}
          fullWidth
          maxWidth="xs"
          PaperProps={{ sx: { borderRadius: "18px", p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 750, color: "primary.main" }}>
            Create Category
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>

            <Button
              variant="contained"
              onClick={handleCreateCategory}
              disabled={categoryLoading}
              sx={{
                borderRadius: "9px",
                textTransform: "none",
                backgroundColor: "primary.main",
              }}
            >
              {categoryLoading ? <CircularProgress size={20} /> : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

function SectionHeader({ icon, title, description }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 3 }}>
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: "12px",
          backgroundColor: "action.selected",
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          "& svg": { fontSize: 22 },
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 17, fontWeight: 750, color: "text.primary" }}>
          {title}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 12.5, mt: 0.35 }}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

function FieldLabel({ children, required = false }) {
  return (
    <Typography sx={{ mb: 0.9, fontSize: 13, fontWeight: 650, color: "text.primary" }}>
      {children}
      {required && <Box component="span" sx={{ color: "error.main" }}> *</Box>}
    </Typography>
  );
}

const sectionCardSx = {
  backgroundColor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "18px",
  p: { xs: 2.25, sm: 3 },
  boxShadow: (theme) =>
    theme.palette.mode === "dark"
      ? "0 8px 24px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.04)"
      : "0 8px 24px rgba(30, 64, 175, 0.045)",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "action.hover",
    "& fieldset": { borderColor: "divider" },
    "&:hover fieldset": { borderColor: "text.secondary" },
    "&.Mui-focused fieldset": { borderColor: "primary.main" },
  },
};
