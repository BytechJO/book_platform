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
  const [shortImageError, setShortImageError] = useState("");
  const [longImageError, setLongImageError] = useState("");
  const { books } = useGetBooks();
  const schema = yup.object().shape({
    title: yup
      .string()
      .trim()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),

    description: yup.string().nullable(),

    isbn: yup
      .string()
      .required("ISBN is required")
      .matches(/^[0-9-]*$/, "ISBN must contain only numbers and dashes"),

    app_store_url: yup.string().nullable().url("Invalid App Store URL"),

    google_play_url: yup.string().nullable().url("Invalid Google Play URL"),

    online_book_url: yup.string().nullable().url("Invalid Online Book URL"),
  });

  useEffect(() => {
    if (isEdit && books.length > 0) {
      const book = books.find((b) => b.id === parseInt(id));

      if (book) {
        setValue("title", book.title || "");
        setValue("description", book.description || "");
        setValue("app_store_url", book.app_store_url || "");
        setValue("google_play_url", book.google_play_url || "");
        setValue("online_book_url", book.online_book_url || "");
        setValue("isbn", book.isbn || "");

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
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      isbn: "",
      app_store_url: "",
      google_play_url: "",
      online_book_url: "",
    },
  });
  const handleImageChange = (file, type) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === "short") {
      setShortImage(file);
      setShortPreview(previewUrl);
      setShortImageError("");
    } else {
      setLongImage(file);
      setLongPreview(previewUrl);
      setLongImageError("");
    }
  };
  const onSubmit = async (data) => {
    if (!shortImage && !shortPreview) {
      setShortImageError("Short cover image is required");
      return;
    } else {
      setShortImageError("");
    }

    if (!longImage && !longPreview) {
      setLongImageError("Long cover image is required");
      return;
    } else {
      setLongImageError("");
    }

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
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
      } else if (message === "ISBN already exists") {
        setError("isbn", {
          type: "server",
          message: "ISBN already exists",
        });
      } else if (message === "ISBN is required") {
        setError("isbn", {
          type: "server",
          message: "ISBN is required",
        });
      } else {
        console.log(message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

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
                helperText={errors.title?.message}
                fullWidth
              />
              <TextField
                label="Description"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                label="ISBN"
                {...register("isbn")}
                error={!!errors.isbn}
                helperText={errors.isbn?.message}
                fullWidth
              />
              <TextField
                label="App Store URL"
                {...register("app_store_url")}
                error={!!errors.app_store_url}
                helperText={errors.app_store_url?.message}
                fullWidth
              />

              <TextField
                label="Google Play URL"
                {...register("google_play_url")}
                error={!!errors.google_play_url}
                helperText={errors.google_play_url?.message}
                fullWidth
              />

              <TextField
                label="Online Book URL"
                {...register("online_book_url")}
                error={!!errors.online_book_url}
                helperText={errors.online_book_url?.message}
                fullWidth
              />
              <Stack spacing={4}>
                {/* Short Image */}
                <ImageUploadBox
                  label="Short Cover (3:4)"
                  preview={shortPreview}
                  onFileSelect={(file) => handleImageChange(file, "short")}
                />

                {shortImageError && (
                  <Typography color="error" fontSize={14}>
                    {shortImageError}
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
      </Box>
    </>
  );
}
