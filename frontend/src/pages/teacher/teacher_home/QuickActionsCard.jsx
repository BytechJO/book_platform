import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupsIcon from "@mui/icons-material/Groups";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import axiosInstance from "../../../api/axios";
import ENDPOINTS from "../../../api/endpoints";
import KeyIcon from "@mui/icons-material/Key";
import { useGetMyBooks } from "../../../api/user_books";
import { useGetClassesByBook } from "../../../api/Classes";
import useRateLimitCountdown from "../../../hooks/useRateLimitCountdown";
import QrScanButton from "../../../components/QrScanButton";
export default function QuickActionsCard() {
  const [openDialog, setOpenDialog] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [activateLoading, setActivateLoading] = useState(false);
  const [activationError, setActivationError] = useState("");
  const [showActivationRateLimit, setShowActivationRateLimit] = useState(false);
  const [openClassDialog, setOpenClassDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [className, setClassName] = useState("");
  const [loadingClass, setLoadingClass] = useState(false);
  const { classes } = useGetClassesByBook(selectedBook);
  const { books } = useGetMyBooks();
  const bookActivationLimit = useRateLimitCountdown("book-activation");
  const closeActivationDialog = () => {
    setOpenDialog(false);
    setActivationCode("");
    setActivationError("");
    setShowActivationRateLimit(false);
  };
  const closeClassDialog = () => {
    setOpenClassDialog(false);
    setSelectedBook("");
    setClassName("");
  };
  const generateClassName = (classes = [], id) => {
    const letters = classes.map((c) => c.class_name?.split("-")[0]);

    let nextCharCode = 65;

    while (letters.includes(String.fromCharCode(nextCharCode))) {
      nextCharCode++;
    }

    return `${String.fromCharCode(nextCharCode)}-${id}`;
  };
  useEffect(() => {
    if (!selectedBook) return;

    if (!selectedBook || !books.length) return;

    const book = books.find((b) => b.id == selectedBook);
    if (!book) return;
    const generated = generateClassName(
      classes, // 🔥 هون الصح
      book?.user_book_id,
    );

    setClassName(generated);
  }, [books, classes, selectedBook]);
  const handleSelectBook = (bookId) => {
    setSelectedBook(bookId);
  };
  const handleCreateClass = async (event) => {
    event?.preventDefault();

    if (!selectedBook || !className) return;

    try {
      setLoadingClass(true);

      const book = books.find((b) => b.id === Number(selectedBook));
      await axiosInstance.post(
        ENDPOINTS.User_book.AddClass(book.user_book_id),
        {
          class_name: className,
        },
      );

      closeClassDialog();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClass(false);
    }
  };
  const handleActivateCode = async (e) => {
    e.preventDefault();

    if (!activationCode.trim()) {
      setActivationError("Please enter a valid activation code");
      return;
    }

    try {
      setActivateLoading(true);
      setActivationError("");

      await axiosInstance.post(ENDPOINTS.User_book.Create, {
        code: activationCode,
      });
      bookActivationLimit.clearRateLimit();
      closeActivationDialog();
    } catch (err) {
      console.error(err);

      if (bookActivationLimit.startFromError(err)) {
        setActivationError("");
        setShowActivationRateLimit(true);
        return;
      }

      const message = err.response?.data?.message || "Invalid activation code";

      setActivationError(message);
    } finally {
      setActivateLoading(false);
    }
  };
  return (
    <Box sx={cardStyle}>
      <Typography sx={title}>Quick Actions</Typography>

      <Box sx={actionsWrapper}>
        {/* Assign Book */}
        <Box sx={item} onClick={() => setOpenDialog(true)}>
          <Box sx={iconBox}>
            <MenuBookIcon />
          </Box>
          <Typography sx={label}>Assign Book</Typography>
        </Box>

        {/* Create Class */}
        <Box sx={item} onClick={() => setOpenClassDialog(true)}>
          <Box sx={iconBox}>
            <GroupsIcon />
          </Box>
          <Typography sx={label}>Create Class</Typography>
        </Box>
      </Box>
      <Dialog
        open={openDialog}
        onClose={closeActivationDialog}
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          sx: { backgroundColor: "rgba(0,0,0,0.6)" },
        }}
        PaperProps={{
          component: "form",
          onSubmit: handleActivateCode,
          sx: {
            borderRadius: "20px",
            p: 4,
            textAlign: "center",
          },
        }}
      >
        {/* ICON */}
        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "#e8f0fe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            mb: 2,
          }}
        >
          <KeyIcon sx={{ color: "#2d5aa7", fontSize: 32 }} />
        </Box>
        {/* TITLE */}
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 700,
            color: "#2d5aa7",
            mb: 1,
          }}
        >
          Activate Code
        </Typography>

        {/* DESCRIPTION */}
        <Typography
          sx={{
            fontSize: 14,
            color: "#6b7280",
            mb: 3,
          }}
        >
          Enter your activation code to access your class or content.
        </Typography>

        {/* INPUT LABEL */}
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            mb: 1,
            textAlign: "left",
          }}
        >
          Activation Code *
        </Typography>

        {/* INPUT */}
        <TextField
          fullWidth
          value={activationCode}
          onChange={(e) => {
            setActivationCode(e.target.value);
            if (activationError) setActivationError("");
          }}
          placeholder="Enter activation code"
          error={
            Boolean(activationError) ||
            (showActivationRateLimit && bookActivationLimit.isRateLimited)
          }
          helperText={
            showActivationRateLimit && bookActivationLimit.isRateLimited
              ? bookActivationLimit.message
              : activationError
          }
          InputProps={{
            endAdornment: (
              <QrScanButton
                kind="book"
                title="Scan book QR code"
                onScan={({ code }) => {
                  setActivationCode(code);
                  setActivationError("");
                }}
              />
            ),
            sx: {
              height: 50,
              borderRadius: "10px",
              backgroundColor: "#f9fbff",
            },
          }}
        />

        {/* BUTTONS */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 4,
          }}
        >
          <LoadingButton
            type="submit"
            loading={activateLoading}
            variant="contained"
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#2d5aa7",
              "&:hover": {
                backgroundColor: "#244a87",
              },
            }}
          >
            Activate
          </LoadingButton>

          <Button
            onClick={closeActivationDialog}
            variant="contained"
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#e5e7eb",
              color: "#374151",
              "&:hover": {
                backgroundColor: "#d1d5db",
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Dialog>
      <Dialog
        open={openClassDialog}
        onClose={closeClassDialog}
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          sx: { backgroundColor: "rgba(0,0,0,0.6)" },
        }}
        PaperProps={{
          component: "form",
          onSubmit: handleCreateClass,
          sx: {
            borderRadius: "20px",
            p: { xs: 3, sm: 4 },
            textAlign: "center",
          },
        }}
      >
        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "#e8f0fe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            mb: 2,
          }}
        >
          <GroupsIcon sx={{ color: "#2d5aa7", fontSize: 34 }} />
        </Box>

        <Typography
          sx={{ fontSize: 22, fontWeight: 700, color: "#2d5aa7", mb: 1 }}
        >
          Create Class
        </Typography>

        <Typography sx={{ fontSize: 14, color: "#6b7280", mb: 3 }}>
          Select a book to generate a new class for your students.
        </Typography>

        <Typography
          sx={{ fontSize: 13, fontWeight: 600, mb: 1, textAlign: "left" }}
        >
          Select Book *
        </Typography>
        <TextField
          select
          fullWidth
          value={selectedBook}
          onChange={(e) => handleSelectBook(e.target.value)}
          SelectProps={{ native: true }}
          InputProps={{
            sx: {
              height: 50,
              borderRadius: "10px",
              backgroundColor: "#f9fbff",
            },
          }}
        >
          <option value="">Select a book</option>
          {books
            .filter((b) => b.is_active)
            .map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
        </TextField>

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            mt: 2.5,
            mb: 1,
            textAlign: "left",
          }}
        >
          Class Name
        </Typography>
        <TextField
          fullWidth
          value={className}
          placeholder="Generated automatically"
          InputProps={{
            readOnly: true,
            sx: {
              height: 50,
              borderRadius: "10px",
              backgroundColor: "#f3f4f6",
            },
          }}
        />

        <Box
          sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
        >
          <LoadingButton
            type="submit"
            loading={loadingClass}
            disabled={!selectedBook || !className}
            variant="contained"
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#2d5aa7",
              "&:hover": { backgroundColor: "#244a87" },
            }}
          >
            Create
          </LoadingButton>

          <Button
            onClick={closeClassDialog}
            variant="contained"
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#e5e7eb",
              color: "#374151",
              "&:hover": { backgroundColor: "#d1d5db" },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

const cardStyle = {
  background: "#fff",
  borderRadius: "14px",
  p: 2,
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
};

const title = {
  fontWeight: 600,
  mb: 2,
};

const actionsWrapper = {
  display: "flex",
  justifyContent: "center", // 👈 بالنص
  gap: 8, // 👈 مسافة بينهم
  mt: 5,
};
const item = {
  textAlign: "center",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-3px)",
  },
};

const iconBox = {
  width: 50,
  height: 50,
  borderRadius: "12px",
  background: "#f1f5f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 8px",
  color: "#6b7280",
};

const label = {
  fontSize: 13,
};
