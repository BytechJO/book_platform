import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import { generateQrDataUrl } from "../utils/qrCodes";

const escapeHtml = (value) =>
  String(value || "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });

export default function QrCodeDialog({ open, onClose, title, subtitle, code, value, fileName = "qr-code" }) {
  const [result, setResult] = useState({ value: "", image: "", error: "" });
  const image = result.value === value ? result.image : "";
  const error = result.value === value ? result.error : "";

  useEffect(() => {
    if (!open || !value) return;
    let active = true;
    generateQrDataUrl(value)
      .then((generatedImage) => {
        if (active) setResult({ value, image: generatedImage, error: "" });
      })
      .catch(() => {
        if (active) setResult({ value, image: "", error: "Could not generate QR code." });
      });
    return () => { active = false; };
  }, [open, value]);

  const download = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = `${fileName}.png`;
    link.click();
  };

  const print = () => {
    const printWindow = window.open("", "_blank", "width=600,height=700");
    if (!printWindow) return;
    printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(title)}</title><style>body{font-family:Arial;text-align:center;padding:35px}img{width:330px}h2{margin-bottom:5px}.code{font-size:20px;letter-spacing:2px;margin:12px}.sub{color:#64748b}</style></head><body><h2>${escapeHtml(title)}</h2><div class="sub">${escapeHtml(subtitle)}</div><img src="${image}"/><div class="code">${escapeHtml(code)}</div></body></html>`);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle fontWeight={800}>{title}</DialogTitle>
      <DialogContent>
        <Stack alignItems="center" spacing={1.5}>
          {subtitle && <Typography color="text.secondary" textAlign="center">{subtitle}</Typography>}
          {error && <Alert severity="error">{error}</Alert>}
          {image && <Box component="img" src={image} alt={`QR for ${code}`} sx={{ width: "100%", maxWidth: 320 }} />}
          <Typography fontWeight={800} sx={{ letterSpacing: 1.5 }}>{code}</Typography>
          <Typography variant="caption" color="text.secondary" textAlign="center">Scanning opens the confirmation page. Login is required.</Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}><Button onClick={onClose}>Close</Button><Button startIcon={<PrintIcon />} onClick={print} disabled={!image}>Print</Button><Button variant="contained" startIcon={<DownloadIcon />} onClick={download} disabled={!image}>Download</Button></DialogActions>
    </Dialog>
  );
}
