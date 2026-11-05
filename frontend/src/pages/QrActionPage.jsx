import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axiosInstance from "../api/axios";
import ENDPOINTS from "../api/endpoints";
import CurveLoader from "../components/CurveLoader";

export default function QrActionPage({ action }) {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const code = params.get("code")?.trim() || "";
  const bookId = params.get("bookId") || "";
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(action === "class" && Boolean(token));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      sessionStorage.setItem("pendingQrAction", `${location.pathname}${location.search}`);
      navigate("/login", { replace: true });
      return;
    }

    if (action !== "class" || role !== "student") {
      setLoading(false);
      return;
    }

    let active = true;
    axiosInstance
      .get(ENDPOINTS.User_book.my_books)
      .then((response) => {
        if (!active) return;
        const matched = response.data.find(
          (item) => String(item.book_id || item.id) === String(bookId),
        );
        setBook(matched || null);
        if (!matched) {
          setError("You must activate this book before joining its class.");
        } else if (matched.is_active === false) {
          setError("Your access to this book has expired. Renew it before joining the class.");
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Could not verify your book access.");
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [action, bookId, location.pathname, location.search, navigate, role, token]);

  const confirm = async () => {
    if (!code) return setError("The QR code does not contain a valid code.");
    try {
      setSubmitting(true);
      setError("");
      if (action === "book") {
        if (!["student", "teacher"].includes(role)) {
          throw new Error("Only students and teachers can activate books.");
        }
        await axiosInstance.post(ENDPOINTS.User_book.Create, { code });
        setSuccess("Book activated successfully.");
      } else {
        if (role !== "student") throw new Error("Only students can join classes.");
        if (!book) throw new Error("Activate the book before joining this class.");
        if (book.is_active === false) {
          throw new Error("Renew the book before joining this class.");
        }
        await axiosInstance.post(
          ENDPOINTS.User_book.activateClassCode(book.user_book_id),
          { class_code: code },
        );
        setSuccess("You joined the class successfully.");
      }
      sessionStorage.removeItem("pendingQrAction");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "The action could not be completed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || loading) return <CurveLoader />;

  const isBookAction = action === "book";
  const roleError =
    action === "class" && role !== "student"
      ? "Only students can join classes."
      : action === "book" && !["student", "teacher"].includes(role)
        ? "Only students and teachers can activate books."
        : "";
  const cancel = () => {
    sessionStorage.removeItem("pendingQrAction");
    navigate(`/${role}`, { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2, bgcolor: "#f8fafc" }}>
      <Paper elevation={0} sx={{ width: "100%", maxWidth: 520, p: { xs: 3, sm: 4 }, border: "1px solid #e2e8f0", borderRadius: 4, textAlign: "center" }}>
        <Box sx={{ width: 64, height: 64, display: "grid", placeItems: "center", mx: "auto", borderRadius: 3, bgcolor: "#eef2ff", color: "#1f3c88" }}><QrCode2Icon sx={{ fontSize: 36 }} /></Box>
        <Typography variant="h5" fontWeight={800} sx={{ mt: 2 }}>{isBookAction ? "Activate book" : "Join class"}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>{isBookAction ? "Confirm that you want to activate the book using this code." : "Confirm that you want to join this class."}</Typography>
        <Chip label={code || "Invalid code"} sx={{ mt: 2, fontWeight: 800, letterSpacing: 1 }} />
        {book && <Typography variant="body2" sx={{ mt: 1 }}>Book: <strong>{book.title}</strong></Typography>}
        <Stack spacing={1.5} sx={{ mt: 3 }}>
          {(error || roleError) && <Alert severity="error">{error || roleError}</Alert>}
          {success && <Alert severity="success" icon={<CheckCircleOutlineIcon />}>{success}</Alert>}
          {!success ? <Button variant="contained" size="large" disabled={submitting || !code || Boolean(roleError) || (action === "class" && (!book || book.is_active === false))} onClick={confirm}>{submitting ? "Please wait..." : isBookAction ? "Confirm activation" : "Join class"}</Button> : <Button variant="contained" onClick={() => navigate(isBookAction ? `/${role}/books` : "/student/classes", { replace: true })}>Continue</Button>}
          {!success && <Button onClick={cancel}>Cancel</Button>}
        </Stack>
      </Paper>
    </Box>
  );
}
