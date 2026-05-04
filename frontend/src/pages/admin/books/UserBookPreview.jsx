import {
  Box,
  Typography,
  Stack,
  Card,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import AppleCircleIcon from "src/components/icons/AppleCircleIcon";
import AndroidCircleIcon from "src/components/icons/AndroidCircleIcon";
import onlineIcon1 from "src/assets/icon/onlineIcon.png";
import { useState } from "react";
import PrinterIcon from "src/components/icons/PrinterIcon";
import ISPNIconButton from "src/components/icons/ISPNIcon";

export default function UserBookPreview({ book, onClose }) {
  const [expanded, setExpanded] = useState(false);
  const shortText = book.description?.slice(0, 200) || "";
  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);
  const isRTL = isArabic(book.title);

  return (
    <Box sx={{ backgroundColor: "#fff", p: 3 }}>
      {/* ❌ CLOSE */}
      <Button
        onClick={onClose}
        sx={{ position: "absolute", top: 20, right: 20 }}
      >
        ✕
      </Button>

      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", md: isRTL ? "row" : "row-reverse" }}
          spacing={6}
        >
          {/* 🔵 LEFT */}
          <Box
            sx={{
              width: { xs: "100%", md: 450 }, // 🔥 بدل 420
              position: "relative",
              height: "auto",
            }}
          >
            {/* 🔵 IMAGE */}
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                overflow: "hidden",
                boxShadow: "0px 10px 15px -5px rgba(0,0,0,0.35)",
              }}
            >
              <Box
                component="img"
                src={book.cover_image_url_long}
                alt={book.title}
                sx={{
                  width: "100%",
                  display: "block",
                  transform: "scale(1.06)", // 🔥 مهم
                  transformOrigin: "center",
                  height: "auto",
                  boxShadow: "5px 5px 15px 5px #888888", // 🔥 مهم
                }}
              />
            </Box>

            {/* ⚪ INFO BOX */}
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                mt: "-60px",
                pt: 8,
                px: 4,
                pb: 2,
                borderRadius: "28px",
                backgroundColor: "#ffffff",
                boxShadow: "0 20px 45px rgba(0,0,0,0.08)",
                border: "1px solid #E1E1E1",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#2d5aa7",
                  fontSize: 18,
                  mt: 2,
                  mb: 1,
                }}
              >
                Information
              </Typography>

              {/* ISBN */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <ISPNIconButton size={20} />
                <Typography sx={{ fontSize: 12 }}>
                  ISBN: {book.isbn || "—"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <PrinterIcon size={20} />
                <Typography sx={{ fontSize: 12 }}>
                  {book.publisher || "Al-Rowad for Publishing & Distribution"}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />

              {/* AVAILABLE */}
              <Typography sx={{ fontWeight: 600, mb: 2, color: "#1A4D96" }}>
                Available on
              </Typography>

              <Stack direction="row" spacing={2}>
                {book.app_store_url && (
                  <Box
                    onClick={() => window.open(book.app_store_url, "_blank")}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <AppleCircleIcon width={40} height={40} />
                    <Typography variant="caption">App Store</Typography>
                  </Box>
                )}

                {book.google_play_url && (
                  <Box
                    onClick={() => window.open(book.google_play_url, "_blank")}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <AndroidCircleIcon width={40} height={40} />
                    <Typography variant="caption">Google play</Typography>
                  </Box>
                )}

                {book.online_book_url && (
                  <Box
                    onClick={() => window.open(book.online_book_url, "_blank")}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box component="img" src={onlineIcon1} sx={{ width: 40 }} />
                    <Typography variant="caption">Online book</Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Box>
          {/* 🔵 RIGHT */}
          <Box sx={{ flex: 1 }}>
            {/* TITLE */}
            <Typography fontSize={30} fontWeight={700} color="#2d5aa7">
              {book.title}
            </Typography>

            {/* DESCRIPTION */}
            <Box mt={3}>
              <Typography fontWeight={700} color="#1A4D96">
                Description
              </Typography>

              <Typography sx={{ mt: 1, lineHeight: 1.9 }}>
                {expanded
                  ? book.description
                  : `${shortText}${
                      book.description?.length > 200 ? "..." : ""
                    }`}
              </Typography>

              {book.description?.length > 200 && (
                <Button onClick={() => setExpanded(!expanded)} sx={{ mt: 1 }}>
                  {expanded ? "Show less" : "Read more"}
                </Button>
              )}
            </Box>
          </Box>
        </Stack>

        {/* FOOTER */}
        <Typography textAlign="center" mt={4} color="#2d5aa7">
          alrowadpub.com
        </Typography>
      </Box>
    </Box>
  );
}
