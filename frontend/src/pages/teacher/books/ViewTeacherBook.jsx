import { useState } from "react";
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
  Chip,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import ISPNIconButton from "src/components/icons/ISPNIcon";
import PrinterIcon from "src/components/icons/PrinterIcon";
import AppleCircleIcon from "src/components/icons/AppleCircleIcon";
import AndroidCircleIcon from "src/components/icons/AndroidCircleIcon";

import onlineIcon1 from "src/assets/icon/onlineIcon.png";

import { useGetMyOneBook } from "src/api/user_books";
import AccessMessage from "src/components/AccessMessage";

import axiosInstance from "../../../api/axios";
import ENDPOINTS from "../../../api/endpoints";
import CurveLoader from "../../../components/CurveLoader";

import { useDashboardLanguage } from "../../../contexts/dashboardLanguage";

export default function ViewTeacherBook() {
  const { t } = useDashboardLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const { book, loading, error, refetch } = useGetMyOneBook(id);

  const [loadingClass, setLoadingClass] = useState(false);
  const [open, setOpen] = useState(false);
  const [classInput, setClassInput] = useState("");
  const [expanded, setExpanded] = useState(false);

  const isArabic = (text) => /[\u0600-\u06FF]/.test(text || "");

  const closeClassDialog = () => {
    setOpen(false);
    setClassInput("");
  };

  const generateClassName = (classes = [], id) => {
    const letters = classes.map((c) => c.class_name?.split("-")[0]);

    let nextCharCode = 65;

    while (letters.includes(String.fromCharCode(nextCharCode))) {
      nextCharCode++;
    }

    return `${String.fromCharCode(nextCharCode)}-${id}`;
  };

  const handleSaveClass = async () => {
    try {
      setLoadingClass(true);

      await axiosInstance.post(
        ENDPOINTS.User_book.AddClass(book.user_book_id),
        {
          class_name: classInput,
        },
      );

      await refetch();
      closeClassDialog();
    } catch (err) {
      console.error(err);
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

  const shortText = book.description?.slice(0, 200) || "";

  return (
    <>
      <Helmet>
        <title>{t("Book details")} - Teacher Dashboard</title>
      </Helmet>

      <Box
        dir="ltr"
        sx={{
          display: "flex",
          justifyContent: "center",
          direction: "ltr",
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            width: "100%",
            mx: "auto",
            px: 2,
          }}
        >
          {/* BACK BUTTON */}
          <Typography
            onClick={() => navigate("/teacher/books")}
            sx={{
              mb: 3,
              cursor: "pointer",
              color: "primary.main",
              fontWeight: 600,
              fontSize: 15,
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              direction: "ltr",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            {t("Back to Books")}
          </Typography>

          {/* MAIN CONTENT */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={6}
            alignItems="flex-start"
            sx={{
              direction: "ltr",
              width: "100%",
            }}
          >
            {/* LEFT SIDE - IMAGE AND INFORMATION */}
            <Box
              sx={{
                width: { xs: "100%", md: 420 },
                flexShrink: 0,
                position: "relative",
                height: "auto",
                direction: "ltr",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  p: 2,
                  borderRadius: "20px",
                  backgroundColor: "background.paper",
                  boxShadow: "0 0 12px rgba(0,0,0,0.06)",
                }}
              >
                {/* BOOK IMAGE */}
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

                {/* INFORMATION */}
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

                {/* ISBN */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                    direction: "ltr",
                  }}
                >
                  <ISPNIconButton size={20} />

                  <Typography sx={{ fontSize: 12 }}>
                    ISBN: {book.isbn || "—"}
                  </Typography>
                </Box>

                {/* PUBLISHER */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                    direction: "ltr",
                  }}
                >
                  <PrinterIcon size={20} />

                  <Typography sx={{ fontSize: 12 }}>
                    {t("Al-Rowad for Publishing & Distribution")}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1,
                  }}
                />

                <Divider sx={{ my: 1 }} />

                {/* AVAILABLE ON */}
                <Typography
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: "primary.main",
                  }}
                >
                  {t("Available on")}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ direction: "ltr" }}>
                  {book.app_store_url && (
                    <Box
                      onClick={() =>
                        window.open(
                          book.app_store_url,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
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
                        window.open(
                          book.google_play_url,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <AndroidCircleIcon width={40} height={40} />

                      <Typography variant="caption">Google Play</Typography>
                    </Box>
                  )}

                  {book.online_book_url && (
                    <Box
                      onClick={() =>
                        window.open(
                          book.online_book_url,
                          "_blank",
                          "noopener,noreferrer",
                        )
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
                        alt="Online book"
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

            {/* RIGHT SIDE - BOOK DETAILS */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                textAlign: "left",
                direction: "ltr",
                pt: { xs: 4, md: 2 },
              }}
            >
              {/* BOOK TITLE */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  dir={isArabic(book.title) ? "rtl" : "ltr"}
                  sx={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1.5,
                    textAlign: isArabic(book.title) ? "right" : "left",
                  }}
                >
                  {book.title}
                </Typography>
              </Box>

              {/* DESCRIPTION SECTION */}
              <Box
                sx={{
                  mb: 4,
                  p: expanded ? 3 : 0,
                  backgroundColor: expanded
                    ? "rgba(26, 77, 150, 0.03)"
                    : "transparent",
                  borderRadius: "16px",
                  border: expanded
                    ? "1px solid rgba(26, 77, 150, 0.1)"
                    : "none",
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
                      backgroundColor: "#1A4D96",
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: 14,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      textAlign: "right",
                    }}
                  >
                    {t("Description")}
                  </Typography>
                </Box>

                <Typography
                  dir={isArabic(book.description) ? "rtl" : "ltr"}
                  sx={{
                    lineHeight: 1.9,
                    textAlign: "justify",
                    fontSize: 16,
                    color: "text.secondary",
                  }}
                >
                  {expanded
                    ? book.description
                    : `${shortText}${
                        book.description?.length > 200 ? "..." : ""
                      }`}
                </Typography>

                {book.description?.length > 200 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 1,
                      direction: "ltr",
                    }}
                  >
                    <Button
                      onClick={() => setExpanded(!expanded)}
                      startIcon={
                        <KeyboardArrowDownIcon
                          sx={{
                            transition: "0.3s",
                            transform: expanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      }
                      sx={{
                        p: 0,
                        color: "primary.main",
                        fontWeight: 600,
                        fontSize: 14,
                        textTransform: "none",
                        direction: "ltr",

                        "& .MuiButton-startIcon": {
                          marginRight: "4px",
                          marginLeft: 0,
                        },

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

              {/* CLASSES SECTION */}
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
                      backgroundColor: "#1A4D96",
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: 14,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      textAlign: "right",
                    }}
                  >
                    {t("Classes")}
                  </Typography>
                </Box>

                {book.classes?.length > 0 ? (
                  <Box
                    sx={{
                      p: 2.5,
                      backgroundColor: "background.paper",
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                      mb: 3,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{ direction: "ltr" }}
                    >
                      {book.classes.map((c, index) => (
                        <Chip
                          key={c.class_id ?? c.id ?? index}
                          label={c.class_name}
                          clickable
                          onClick={() =>
                            navigate(`/teacher/classes/${c.class_id ?? c.id}`)
                          }
                          sx={{
                            backgroundColor: "rgba(21,101,192,0.12)",
                            color: "#1565C0",
                            fontWeight: 600,
                            fontSize: 14,
                            borderRadius: "8px",
                            py: 2.5,
                            border: "1px solid #BBDEFB",
                            cursor: "pointer",
                            transition: "all 0.2s ease-in-out",

                            "&:hover": {
                              backgroundColor: "#BBDEFB",
                            },

                            "&:focus-visible": {
                              outline: "3px solid #2563eb",
                              outlineOffset: "3px",
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "#a0aec0",
                      mb: 3,
                      fontStyle: "italic",
                    }}
                  >
                    {t("No classes added yet")}
                  </Typography>
                )}

                {/* ADD CLASS */}
                <Box
                  sx={{
                    border: "2px dashed rgba(26, 77, 150, 0.3)",
                    borderRadius: "12px",
                    p: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(26, 77, 150, 0.02)",
                    direction: "ltr",
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 15,
                        color: "primary.main",
                        fontWeight: 600,
                        textAlign: "start",
                      }}
                    >
                      {t("Create a new class")}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "text.secondary",
                        mt: 0.3,
                      }}
                    >
                      {t(
                        "A unique class code will be generated automatically.",
                      )}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "8px",
                      borderWidth: 2,
                      color: "primary.main",
                      borderColor: "#1A4D96",
                      fontWeight: 600,
                      textTransform: "none",
                      px: 3,
                      py: 1,
                      whiteSpace: "nowrap",
                      flexShrink: 0,

                      "&:hover": {
                        borderWidth: 2,
                        backgroundColor: "rgba(21,101,192,0.12)",
                        borderColor: "#1A4D96",
                      },
                    }}
                    onClick={() => {
                      const generated = generateClassName(
                        book.classes || [],
                        book.user_book_id,
                      );

                      setClassInput(generated);
                      setOpen(true);
                    }}
                  >
                    {t("Add Class")}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Stack>

          {/* BOTTOM TEXT */}
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

        {/* ADD CLASS DIALOG */}
        <Dialog
          open={open}
          onClose={loadingClass ? undefined : closeClassDialog}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>{t("Set Class")}</DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label={t("Class Name")}
              value={classInput}
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />

            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={handleSaveClass}
              disabled={loadingClass}
            >
              {loadingClass ? t("Saving...") : t("Save")}
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}
