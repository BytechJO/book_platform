import {
  Box,
  Typography,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ISPNIconButton from "src/components/icons/ISPNIcon";
import PrinterIcon from "src/components/icons/PrinterIcon";
import AppleCircleIcon from "src/components/icons/AppleCircleIcon";
import AndroidCircleIcon from "src/components/icons/AndroidCircleIcon";
import onlineIcon1 from "src/assets/icon/onlineIcon.png";
import { Helmet } from "react-helmet-async";
import AccessMessage from "src/components/AccessMessage";
import { useState } from "react";
import axiosInstance from "../../../api/axios";
import ENDPOINTS from "../../../api/endpoints";
import { useGetStudentBook } from "../../../api/user_books";
import CurveLoader from "../../../components/CurveLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useRateLimitCountdown from "../../../hooks/useRateLimitCountdown";
import QrScanButton from "../../../components/QrScanButton";
import { useDashboardLanguage } from "../../../contexts/dashboardLanguage";

export default function ViewStudentBook() {
  const { t, language } = useDashboardLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [loadingClass, setLoadingClass] = useState(false);
  const isArabic = (text) => /[\u0600-\u06FF]/.test(text || "");
  const { book, loading, error, refetch } = useGetStudentBook(id);
  const [expanded, setExpanded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showClassRateLimit, setShowClassRateLimit] = useState(false);
  const classCodeLimit = useRateLimitCountdown("class-code", t);
  const closeClassDialog = () => {
    setOpen(false);
    setClassCode("");
    setErrorMsg("");
    setShowClassRateLimit(false);
  };

  const shortText = book?.description?.slice(0, 200) || "";
  const handleActivateClass = async () => {
    try {
      setLoadingClass(true);
      setErrorMsg(""); // reset

      await axiosInstance.post(
        ENDPOINTS.User_book.activateClassCode(book.user_book_id),
        {
          class_code: classCode,
        },
      );

      classCodeLimit.clearRateLimit();
      refetch();
      closeClassDialog();
    } catch (err) {
      console.error(err);

      if (classCodeLimit.startFromError(err)) {
        setErrorMsg("");
        setShowClassRateLimit(true);
        return;
      }

      const message = err?.response?.data?.message || t("Something went wrong");

      setErrorMsg(message);
    } finally {
      setLoadingClass(false);
    }
  };
  if (loading) {
    return <CurveLoader />;
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

  return (
    <>
      <Helmet>
        <title>{t("Book details")} - Student Dashboard</title>
      </Helmet>
      <Box
        dir="ltr"
        sx={{
          display: "flex",
          justifyContent: "center",
          direction: "ltr",
        }}
      >
        <Box sx={{ maxWidth: 1200, width: "100%", mx: "auto", px: 1 }}>
          <Typography
            onClick={() => navigate("/Student/books")}
            sx={{
              mb: 2,
              cursor: "pointer",
              color: "primary.main",
              fontWeight: 600,
              fontSize: 15,
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            {t("Back to Books")}
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="flex-start"
            sx={{ direction: "ltr", gap: 6, width: "100%" }}
          >
            {/* LEFT SIDE */}
            <Box
              sx={{
                width: { xs: "100%", md: 420 },
                flexShrink: 0,
                direction: "ltr",
                position: "relative",
                height: "auto",
              }}
            >
              {/* ⚪ INFO BOX */}
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  p: 2,
                  borderRadius: "28px",
                  backgroundColor: "background.paper",
                  boxShadow: "0 20px 45px rgba(0,0,0,0.08)",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {/* 🔵 IMAGE */}
                <Box
                  sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    mb: 3,
                  }}
                >
                  <Box
                    component="img"
                    src={book.cover_image_url_long}
                    alt={book.title}
                    sx={{
                      width: "100%",
                      display: "block",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    fontSize: 18,
                    mt: 2,
                    mb: 1,
                  }}
                >
                  {t("Information")}
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

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1,
                  }}
                ></Box>

                <Divider sx={{ my: 1 }} />

                <Typography
                  sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}
                >
                  {t("Available on")}
                </Typography>

                <Stack direction="row" sx={{ direction: "ltr", gap: 2 }}>
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
                      <Typography variant="caption">
                        {t("Online book")}
                      </Typography>
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
                minWidth: 0,
                pt: 2,
                textAlign: "right",
                direction: "ltr",
              }}
            >
              {/* TITLE SECTION */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  dir={isArabic(book.title) ? "rtl" : "ltr"}
                  sx={{
                    textAlign: "right",
                    fontSize: 30,
                    fontWeight: 700,
                    color: "primary.main",
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
                  p: expanded ? 3 : 0,
                  backgroundColor: expanded
                    ? "rgba(26, 77, 150, 0.03)"
                    : "transparent", // 👈 بدون خلفية بالبداية
                  borderRadius: "16px",
                  border: expanded
                    ? "1px solid rgba(26, 77, 150, 0.1)"
                    : "none", // 👈 بدون بوردر بالبداية
                  transition: "0.3s",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
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
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                      fontSize: 16,
                    }}
                  >
                    {t("Description")}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    lineHeight: 2,
                    textAlign: "right",
                    direction: isArabic(book.description) ? "rtl" : "ltr",
                    fontSize: 16,
                    color: "text.secondary",
                  }}
                >
                  {expanded
                    ? book.description
                    : `${shortText}${book.description?.length > 200 ? "..." : ""}`}
                </Typography>

                {book.description?.length > 200 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      direction: "ltr",
                    }}
                  >
                    <Button
                      onClick={() => setExpanded(!expanded)}
                      sx={{
                        mt: 1,
                        p: 0,
                        color: "primary.main",
                        fontWeight: 600,
                        fontSize: 14,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {t(expanded ? "Show less" : "Read more")}
                    </Button>
                  </Box>
                )}
              </Box>

              {/* 🟣 CLASS SECTION */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
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
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                      fontSize: 16,
                    }}
                  >
                    {t("Class")}
                  </Typography>
                </Box>

                {book.class_name ? (
                  <Box
                    component="button"
                    type="button"
                    onClick={() =>
                      navigate(`/student/classes/${book.class_id}`)
                    }
                    sx={{
                      p: 2.5,
                      width: "100%",
                      backgroundColor: "background.paper",
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 3,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                      cursor: "pointer",
                      textAlign: "right",
                      direction: "rtl",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
                      },
                      "&:focus-visible": {
                        outline: "3px solid #2563eb",
                        outlineOffset: "3px",
                      },
                    }}
                  >
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        sx={{ fontSize: 12, color: "text.secondary", mb: 0.5 }}
                      >
                        {t("Class Name")}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "primary.main",
                        }}
                      >
                        {book.class_name}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        sx={{ fontSize: 12, color: "text.secondary", mb: 0.5 }}
                      >
                        {t("Teacher")}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "primary.main",
                        }}
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
                      direction: "ltr",
                    }}
                  >
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        sx={{
                          fontSize: 15,
                          color: "primary.main",
                          fontWeight: 600,
                        }}
                      >
                        {t("No class assigned yet")}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}
                      >
                        {t("Activate a code to join your class.")}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={() => setOpen(true)}
                      sx={{
                        borderColor: "#2d5aa7",
                        color: "primary.main",
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
                      {t("Activate Class Code")}
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
              color: "primary.main",
            }}
          >
            alrowadpub.com
          </Typography>
        </Box>
        <Dialog open={open} onClose={closeClassDialog}>
          <DialogTitle sx={{ textAlign: language === "ar" ? "right" : "left" }}>
            {t("Activate Class")}
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label={t("Enter Class Code")}
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleActivateClass();
                }
              }}
              dir={language === "ar" ? "rtl" : "ltr"}
              sx={{
                mt: 2,
                "& .MuiInputLabel-root": {
                  left: language === "ar" ? "auto" : 0,
                  right: language === "ar" ? 0 : "auto",
                  transformOrigin: language === "ar" ? "top right" : "top left",
                },
                "& .MuiInputBase-input": {
                  textAlign: language === "ar" ? "right" : "left",
                },
              }}
              error={
                !!errorMsg ||
                (showClassRateLimit && classCodeLimit.isRateLimited)
              }
              helperText={
                showClassRateLimit && classCodeLimit.isRateLimited
                  ? classCodeLimit.message
                  : errorMsg
              }
              InputProps={{
                endAdornment: (
                  <QrScanButton
                    kind="class"
                    title={t("Scan class QR code")}
                    onScan={({ code, bookId }) => {
                      if (bookId && String(bookId) !== String(book.id)) {
                        setErrorMsg(
                          t("This class QR code belongs to another book."),
                        );
                        return;
                      }
                      setClassCode(code);
                      setErrorMsg("");
                    }}
                  />
                ),
              }}
            />
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={handleActivateClass}
              disabled={loadingClass}
            >
              {loadingClass ? `${t("Activating")}...` : t("Activate")}
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}
