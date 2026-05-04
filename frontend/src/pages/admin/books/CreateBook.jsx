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
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import ENDPOINTS from "../../../api/endpoints";
import { Helmet } from "react-helmet-async";
import ImageUploadBox from "../../../components/ImageUploadBox";
import { useGetBooks } from "../../../api";
import { useGetCategories } from "../../../api/categories";
export default function CreateBook() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shortImage, setShortImage] = useState(null);
  const [longImage, setLongImage] = useState(null);
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [shortPreview, setShortPreview] = useState(null);
  const [longPreview, setLongPreview] = useState(null);
  const [longImageError, setLongImageError] = useState("");
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
      setLongImageError("");
    }
  };
  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "short_image") return;

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

      <Box sx={{ py: 4 }}>
        <Box sx={{ maxWidth: 800, mx: "auto", px: 2 }}>
          <Typography sx={{ fontSize: 36, color: "#2d5aa7", mb: 4 }}>
            {isEdit ? "Edit Book" : "Create Book"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                label="Title *"
                {...register("title")}
                error={!!errors.title}
                InputLabelProps={{ shrink: true }}
                helperText={errors.title?.message}
                fullWidth
              />
              <TextField
                label="Description"
                {...register("description")}
                error={!!errors.description}
                InputLabelProps={{ shrink: true }}
                helperText={errors.description?.message}
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                label="Short Description"
                {...register("short_description")}
                error={!!errors.short_description}
                InputLabelProps={{ shrink: true }}
                helperText={errors.short_description?.message}
                multiline
                rows={2}
                fullWidth
              />

              <TextField
                label="App Store URL"
                {...register("app_store_url")}
                error={!!errors.app_store_url}
                InputLabelProps={{ shrink: true }}
                helperText={errors.app_store_url?.message}
                fullWidth
              />

              <TextField
                label="Google Play URL"
                {...register("google_play_url")}
                error={!!errors.google_play_url}
                InputLabelProps={{ shrink: true }}
                helperText={errors.google_play_url?.message}
                fullWidth
              />

              <TextField
                label="Online Book URL"
                {...register("online_book_url")}
                error={!!errors.online_book_url}
                InputLabelProps={{ shrink: true }}
                helperText={errors.online_book_url?.message}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={watch("status")}
                  onChange={(e) => setValue("status", e.target.value)}
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Published">Published</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
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
                    <em>Select Category</em>
                  </MenuItem>

                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}

                  {/* 🔥 زر الإضافة */}
                  <MenuItem
                    value="add_new"
                    sx={{ color: "#2B5A9E", fontWeight: 600 }}
                  >
                    ➕ Add Category
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={watch("language")}
                  onChange={(e) => setValue("language", e.target.value)}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Arabic">Arabic</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
              <Stack spacing={4}>
                {/* Short Image */}
                <ImageUploadBox
                  label="Short Cover (3:4)"
                  preview={shortPreview}
                  onFileSelect={(file) => handleImageChange(file, "short")}
                />

                {errors.short_image && (
                  <Typography color="error" fontSize={14}>
                    {errors.short_image.message}
                  </Typography>
                )}

                <ImageUploadBox
                  label="Long Cover (16:9)"
                  preview={longPreview}
                  onFileSelect={(file) => handleImageChange(file, "long")}
                />

                {longImageError && (
                  <Typography color="error" fontSize={14}>
                    {longImageError}
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    px: 4,
                    height: 45,
                    borderRadius: "8px",
                    textTransform: "none",
                    backgroundColor: "#2B5A9E",
                    "&:hover": { backgroundColor: "#244a86" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} sx={{ color: "white" }} />
                  ) : isEdit ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/books")}
                  sx={{
                    px: 4,
                    height: 45,
                    borderRadius: "8px",
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
        <Dialog
          open={categoryDialogOpen}
          onClose={() => setCategoryDialogOpen(false)}
        >
          <DialogTitle>Create Category</DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Category Name"
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
            >
              {categoryLoading ? <CircularProgress size={20} /> : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
