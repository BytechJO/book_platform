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
} from "@mui/material";
import { useParams } from "react-router-dom";
import ISPNIconButton from "src/components/icons/ISPNIcon";
import PrinterIcon from "src/components/icons/PrinterIcon";
import Icon from "src/assets/icon/icone.svg";
import AppleCircleIcon from "src/components/icons/AppleCircleIcon";
import AndroidCircleIcon from "src/components/icons/AndroidCircleIcon";
import onlineIcon1 from "src/assets/icon/onlineIcon.png";
import { Helmet } from "react-helmet-async";
import SiteLoader from "src/components/SiteLoade";
import AccessMessage from "src/components/AccessMessage";
import { useState } from "react";
import axiosInstance from "../../../api/axios";
import ENDPOINTS from "../../../api/endpoints";
import { useGetStudentBook } from "../../../api/user_books";

export default function ViewStudentBook() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [loadingClass, setLoadingClass] = useState(false);
  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);
  const { book, loading, error, refetch } = useGetStudentBook(id);
  const [expanded, setExpanded] = useState(false);
  const shortText = book.description?.slice(0, 200) || "";
  const handleActivateClass = async () => {
    try {
      setLoadingClass(true);

      await axiosInstance.post(
        ENDPOINTS.User_book.activateClassCode(book.user_book_id),
        {
          class_code: classCode,
        },
      );
      refetch();
      setOpen(false);
      setClassCode("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClass(false);
    }
  };
  if (loading) {
    return <SiteLoader fullScreen text="Loading Books..." />;
  }

  if (error) {
    const status = error?.response?.status;

    if (status === 404) {
      return <AccessMessage type="not_found" />;
    }

    if (status === 403) {
      return <AccessMessage type="expired" />;
    }

    return <AccessMessage type="default" />;
  }

  if (!book) return null;

  const isRTL = isArabic(book.title);
  return (
    <>
      <Helmet>
        <title>Book details - Student Dashboard</title>
      </Helmet>
      <Divider
        sx={{
          width: "100%",
          borderColor: "#1A4D965C",
          mb: 2,
        }}
      />
      <Box
        sx={{
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
          <Stack
            direction={{ xs: "column", md: isRTL ? "row" : "row-reverse" }}
            spacing={6}
            alignItems="flex-start"
          >
            {/* LEFT SIDE */}
            <Box
              sx={{
                width: { xs: "100%", md: 450 },
                position: "relative",
                height: "auto",
              }}
            >
              {/* 🔵 IMAGE */}
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  borderRadius: "24px",
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
                    transform: "scale(1.06)",
                    transformOrigin: "center",
                    height: "auto",
                    boxShadow: "5px 5px 15px 5px #888888",
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
                  pb: 4,
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

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <ISPNIconButton size={20} />
                  <Typography sx={{ color: "#1A4D96", fontSize: 14 }}>
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
                  <Typography sx={{ color: "#1A4D96", fontSize: 14 }}>
                    {book.publisher || "Al-Rowad for Publishing & Distribution"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Box component="img" src={Icon} sx={{ width: 20 }} />
                  <Typography sx={{ color: "#1A4D96", fontSize: 14 }}>
                    Published: {new Date(book.created_at).getFullYear()}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

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
                      onClick={() =>
                        window.open(book.google_play_url, "_blank")
                      }
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
                      onClick={() =>
                        window.open(book.online_book_url, "_blank")
                      }
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={onlineIcon1}
                        sx={{ width: 40 }}
                      />
                      <Typography variant="caption">Online book</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Box>

            {/* RIGHT SIDE */}
            {/* RIGHT SIDE */}
            <Box
              sx={{
                flex: 1,
                pt: 2,
                textAlign: isRTL ? "right" : "left",
                direction: isRTL ? "rtl" : "ltr",
              }}
            >
              {/* TITLE SECTION */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  sx={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: "#2d5aa7",
                    mb: 1.5,
                  }}
                >
                  {book.title}
                </Typography>
              </Box>

              {/* 🟢 DESCRIPTION SECTION */}
              <Box
                sx={{
                  mb: 4,
                  p: 3,
                  backgroundColor: "rgba(26, 77, 150, 0.03)", // خلفية زرقاء فاتحة جداً
                  borderRadius: "16px",
                  border: "1px solid rgba(26, 77, 150, 0.1)",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 22,
                      backgroundColor: "#2d5aa7",
                      borderRadius: 2,
                    }}
                  />
                  <Typography
                    sx={{ fontWeight: 600, color: "#1A4D96", fontSize: 16 }}
                  >
                    Description
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: 15,
                    lineHeight: 2,
                    color: "#1A4D96",
                    textAlign: "justify",
                  }}
                >
                  {expanded
                    ? book.description
                    : `${shortText}${book.description?.length > 200 ? "..." : ""}`}
                </Typography>

                {book.description?.length > 200 && (
                  <Button
                    onClick={() => setExpanded(!expanded)}
                    sx={{
                      mt: 1,
                      p: 0,
                      color: "#2d5aa7",
                      fontWeight: 600,
                      fontSize: 14,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {expanded ? "Show less" : "Read more"}
                  </Button>
                )}
              </Box>

              {/* 🟣 CLASS SECTION */}
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 22,
                      backgroundColor: "#2d5aa7",
                      borderRadius: 2,
                    }}
                  />
                  <Typography
                    sx={{ fontWeight: 600, color: "#1A4D96", fontSize: 16 }}
                  >
                    Class
                  </Typography>
                </Box>

                {book.student_class ? (
                  <Box
                    sx={{
                      p: 2.5,
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #E1E1E1",
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 3,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: 12, color: "#777", mb: 0.5 }}>
                        Class Name
                      </Typography>
                      <Typography
                        sx={{ fontSize: 15, fontWeight: 600, color: "#1A4D96" }}
                      >
                        {book.student_class}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 12, color: "#777", mb: 0.5 }}>
                        Teacher
                      </Typography>
                      <Typography
                        sx={{ fontSize: 15, fontWeight: 600, color: "#1A4D96" }}
                      >
                        {book.teacher_name || "—"}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      border: "2px dashed rgba(26, 77, 150, 0.3)",
                      borderRadius: "12px",
                      p: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      backgroundColor: "rgba(26, 77, 150, 0.02)",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{ fontSize: 15, color: "#1A4D96", fontWeight: 600 }}
                      >
                        No class assigned yet
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: "#666", mt: 0.5 }}>
                        Activate a code to join your class.
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={() => setOpen(true)}
                      sx={{
                        borderColor: "#2d5aa7",
                        color: "#2d5aa7",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "8px",
                        px: 3,
                        "&:hover": {
                          borderColor: "#1A4D96",
                          backgroundColor: "rgba(26, 77, 150, 0.05)",
                        },
                      }}
                    >
                      Activate Class Code
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Stack>

          {/* Bottom Text */}
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: 500,
              fontSize: 14,
              color: "#2d5aa7",
            }}
          >
            alrowadpub.com
          </Typography>
        </Box>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Activate Class</DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Enter Class Code"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={handleActivateClass}
              disabled={loadingClass}
            >
              {loadingClass ? "Activating..." : "Activate"}
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}
