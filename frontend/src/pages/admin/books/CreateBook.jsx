import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import ENDPOINTS from "../../../api/endpoints";
import { Helmet } from "react-helmet-async";
import ImageUploadBox from "../../../components/ImageUploadBox";
import { useGetBooks } from "../../../api";
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
  useEffect(() => {
    if (isEdit && books.length > 0) {
      const book = books.find((b) => b.id === parseInt(id));

      if (book) {
        setForm({
          title: book.title || "",
          description: book.description || "",
          app_store_url: book.app_store_url || "",
          google_play_url: book.google_play_url || "",
          online_book_url: book.online_book_url || "",
          isbn: book.isbn || "",
        });

        setShortPreview(book.cover_image_url_short);

        setLongPreview(book.cover_image_url_long);
      } else {
        navigate("/admin/books");
      }
    }
  }, [id, books, navigate, isEdit]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    isbn: "",
    app_store_url: "",
    google_play_url: "",
    online_book_url: "",
  });
  const handleImageChange = (file, type) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === "short") {
      setShortImage(file);
      setShortPreview(previewUrl);
    } else {
      setLongImage(file);
      setLongPreview(previewUrl);
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (shortImage) formData.append("cover_short", shortImage);
    if (longImage) formData.append("cover_long", longImage);

    try {
      setLoading(true);

      if (isEdit) {
        await axiosInstance.put(ENDPOINTS.BOOKS.UPDATE(id), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post(ENDPOINTS.BOOKS.CREATE, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/admin/books");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Book - Admin Dashboard</title>
      </Helmet>

      <Box sx={{ py: 4 }}>
        <Box sx={{ maxWidth: 800, mx: "auto", px: 2 }}>
          <Typography sx={{ fontSize: 36, color: "#2d5aa7", mb: 4 }}>
            {isEdit ? "Edit Book" : "Create Book"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Title *"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                label="ISBN"
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="App Store URL"
                name="app_store_url"
                value={form.app_store_url}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Google Play URL"
                name="google_play_url"
                value={form.google_play_url}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Online Book URL"
                name="online_book_url"
                value={form.online_book_url}
                onChange={handleChange}
                fullWidth
              />
              <Stack spacing={4}>
                {/* Short Image */}
                <ImageUploadBox
                  label="Short Cover (3:4)"
                  preview={shortPreview}
                  onFileSelect={(file) => handleImageChange(file, "short")}
                />

                {/* Long Image */}
                <ImageUploadBox
                  label="Long Cover (16:9)"
                  preview={longPreview}
                  onFileSelect={(file) => handleImageChange(file, "long")}
                />
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
      </Box>
    </>
  );
}
