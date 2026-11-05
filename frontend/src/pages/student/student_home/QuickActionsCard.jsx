import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupsIcon from "@mui/icons-material/Groups";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import axiosInstance from "../../../api/axios";
import ENDPOINTS from "../../../api/endpoints";
import KeyIcon from "@mui/icons-material/Key";
import { useGetMyBooks } from "../../../api/user_books";
import useRateLimitCountdown from "../../../hooks/useRateLimitCountdown";
import QrScanButton from "../../../components/QrScanButton";
export default function QuickActionsCard({ refetchClasses }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [activateLoading, setActivateLoading] = useState(false);
  const [activationError, setActivationError] = useState("");
  const [showActivationRateLimit, setShowActivationRateLimit] = useState(false);
  const [openClassDialog, setOpenClassDialog] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [loadingClass, setLoadingClass] = useState(false);
  const [classError, setClassError] = useState("");
  const [showClassRateLimit, setShowClassRateLimit] = useState(false);
  const { books, refetch } = useGetMyBooks();
  const bookActivationLimit = useRateLimitCountdown("book-activation");
  const classCodeLimit = useRateLimitCountdown("class-code");
  const closeActivationDialog = () => {
    setOpenDialog(false);
    setActivationCode("");
    setActivationError("");
    setShowActivationRateLimit(false);
  };
  const closeClassDialog = () => {
    setOpenClassDialog(false);
    setSelectedBook("");
    setClassCode("");
    setClassError("");
    setShowClassRateLimit(false);
  };
  const handleActivateClass = async (event) => {
    event?.preventDefault();

    if (!classCode.trim()) {
      setClassError("Please enter class code");
      return;
    }

    try {
      setLoadingClass(true);
      setClassError("");

      await axiosInstance.post(
        ENDPOINTS.User_book.activateClassCode(selectedBook),
        {
          class_code: classCode,
        },
      );
      classCodeLimit.clearRateLimit();
      await refetchClasses();
      closeClassDialog();
    } catch (err) {
      console.error(err);

      if (classCodeLimit.startFromError(err)) {
        setClassError("");
        setShowClassRateLimit(true);
        return;
      }

      const message = err?.response?.data?.message || "Invalid class code";

      setClassError(message);
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
      refetch();
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

          <Typography sx={label}>Add Class</Typography>
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
          onSubmit: handleActivateClass,
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
          Join Class
        </Typography>

        <Typography sx={{ fontSize: 14, color: "#6b7280", mb: 3 }}>
          Select your book and enter the class code provided by your teacher.
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
          onChange={(e) => setSelectedBook(e.target.value)}
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
            .filter((b) => b.is_active && !b.class_name)
            .map((b) => (
              <option key={b.id} value={b.user_book_id}>
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
          Class Code *
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter class code"
          value={classCode}
          onChange={(e) => {
            setClassCode(e.target.value);

            if (classError) setClassError("");
          }}
          error={
            !!classError ||
            (showClassRateLimit && classCodeLimit.isRateLimited)
          }
          helperText={
            showClassRateLimit && classCodeLimit.isRateLimited
              ? classCodeLimit.message
              : classError
          }
          InputProps={{
            endAdornment: (
              <QrScanButton
                kind="class"
                title="Scan class QR code"
                onScan={({ code, bookId }) => {
                  setClassCode(code);
                  setClassError("");
                  if (bookId) {
                    const matchedBook = books.find(
                      (item) => String(item.id) === String(bookId),
                    );
                    if (matchedBook?.is_active && !matchedBook.class_name) {
                      setSelectedBook(matchedBook.user_book_id);
                    }
                  }
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

        <Box
          sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
        >
          <LoadingButton
            type="submit"
            loading={loadingClass}
            disabled={!selectedBook}
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
            Join
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
};

const label = {
  fontSize: 13,
};
