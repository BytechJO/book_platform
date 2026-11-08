import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";

const readPayload = (rawValue, kind) => {
  const raw = rawValue.trim();
  if (!raw) throw new Error("The QR code is empty.");

  try {
    const url = new URL(raw);
    const code = url.searchParams.get("code")?.trim();
    const isBookLink = url.pathname.replace(/\/$/, "") === "/activate-book";
    const isClassLink = url.pathname.replace(/\/$/, "") === "/join-class";

    if (kind === "book" && !isBookLink) {
      throw new Error("This is not a book activation QR code.");
    }
    if (kind === "class" && !isClassLink) {
      throw new Error("This is not a class QR code.");
    }
    if (!code) throw new Error("This QR code does not contain a code.");

    return {
      code,
      bookId: url.searchParams.get("bookId") || "",
      raw,
    };
  } catch (error) {
    if (error instanceof TypeError) return { code: raw, bookId: "", raw };
    throw error;
  }
};

export default function QrScanButton({ kind, onScan, title = "Scan QR code" }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");
  const [readingImage, setReadingImage] = useState(false);
  const videoRef = useRef(null);
  const controlsRef = useRef(null);

  const stopCamera = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
  }, []);

  const close = useCallback(() => {
    stopCamera();
    setOpen(false);
    setMode("");
    setError("");
  }, [stopCamera]);

  const acceptResult = useCallback((raw) => {
    try {
      const payload = readPayload(raw, kind);
      onScan(payload);
      close();
    } catch (scanError) {
      setError(scanError.message || "This QR code is not valid.");
    }
  }, [close, kind, onScan]);

  useEffect(() => {
    if (!open || mode !== "camera" || !videoRef.current) return undefined;

    let active = true;
    const startCamera = async () => {
      try {
        const { BrowserQRCodeReader } = await import("@zxing/browser");
        if (!active) return;
        const reader = new BrowserQRCodeReader(undefined, {
          delayBetweenScanAttempts: 250,
        });
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result, _error, scannerControls) => {
            if (active && result) {
              scannerControls.stop();
              acceptResult(result.getText());
            }
          },
        );
        if (active) controlsRef.current = controls;
        else controls.stop();
      } catch {
        if (active) {
          setError(
            "Camera access is unavailable. Allow camera permission or choose an image instead.",
          );
        }
      }
    };

    startCamera();

    return () => {
      active = false;
      stopCamera();
    };
  }, [acceptResult, mode, open, stopCamera]);

  const scanImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    try {
      setReadingImage(true);
      setError("");
      const { BrowserQRCodeReader } = await import("@zxing/browser");
      const reader = new BrowserQRCodeReader();
      const result = await reader.decodeFromImageUrl(objectUrl);
      acceptResult(result.getText());
    } catch {
      setError("No readable QR code was found in this image.");
    } finally {
      setReadingImage(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <>
      <IconButton
        type="button"
        edge="end"
        onClick={() => setOpen(true)}
        title={title}
        aria-label={title}
        sx={{ color: "primary.main" }}
      >
        <QrCodeScannerIcon />
      </IconButton>

      <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle fontWeight={800}>{title}</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            Use your camera or select a QR image from your device.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {mode === "camera" && (
            <Box
              component="video"
              ref={videoRef}
              muted
              playsInline
              sx={{
                display: "block",
                width: "100%",
                minHeight: 260,
                borderRadius: 2,
                objectFit: "cover",
                bgcolor: "#0f172a",
              }}
            />
          )}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: mode ? 2 : 0 }}>
            <Button
              type="button"
              fullWidth
              variant={mode === "camera" ? "contained" : "outlined"}
              startIcon={<PhotoCameraOutlinedIcon />}
              onClick={() => {
                setError("");
                setMode("camera");
              }}
            >
              Use camera
            </Button>
            <Button
              type="button"
              fullWidth
              component="label"
              variant="outlined"
              startIcon={<PhotoLibraryOutlinedIcon />}
              disabled={readingImage}
            >
              {readingImage ? "Reading..." : "Choose image"}
              <input hidden type="file" accept="image/*" onChange={scanImage} />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button type="button" onClick={close}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
