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
import { useParams } from "react-router-dom";
import ISPNIconButton from "src/components/icons/ISPNIcon";
import PrinterIcon from "src/components/icons/PrinterIcon";
import Icon from "src/assets/icon/icone.svg";
import AppleCircleIcon from "src/components/icons/AppleCircleIcon";
import AndroidCircleIcon from "src/components/icons/AndroidCircleIcon";
import onlineIcon1 from "src/assets/icon/onlineIcon.png";
import { useGetMyOneBook } from "src/api/user_books";
import { Helmet } from "react-helmet-async";
import AccessMessage from "src/components/AccessMessage";
import { useState } from "react";
import axiosInstance from "../../../api/axios";
import ENDPOINTS from "../../../api/endpoints";
import CurveLoader from "../../../components/CurveLoader";

export default function ViewTeacherBook() {
  const { id } = useParams();
  const [loadingClass, setLoadingClass] = useState(false);
  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);
  const { book, loading, error, refetch } = useGetMyOneBook(id);
  console.log("error", error);
  const [open, setOpen] = useState(false);
  const [classInput, setClassInput] = useState("");
  const [expanded, setExpanded] = useState(false);
  const shortText = book.description?.slice(0, 200) || "";
  if (loading) {
    return <CurveLoader />;
  }
  const generateClassName = (classes = [], id) => {
    const safeClasses = classes || []; // 👈 الحل
    const nextLetter = String.fromCharCode(65 + safeClasses.length);
    return `${nextLetter}-${id}`;
  };

  const handleSaveClass = async () => {
    try {
      setLoadingClass(true); // 👈 start loading

      const finalClass = classInput;

      await axiosInstance.post(
        ENDPOINTS.User_book.AddClass(book.user_book_id),
        {
          class_name: finalClass,
        },
      );

      await refetch();

      setOpen(false);
      setClassInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClass(false); // 👈 stop loading
    }
  };
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
        <title>Book details - Teacher Dashboard</title>
      </Helmet>
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
                    Al-Rowad for Publishing & Distribution
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
                  <Typography sx={{ fontSize: 12 }}>
                    Published:{new Date(book.created_at).getFullYear()}
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
                textAlign: isRTL ? "right" : "left",
                direction: isRTL ? "rtl" : "ltr", // 🔥 أهم سطر
                pt: { xs: 4, md: 2 },
              }}
            >
              {/* 🔵 TITLE */}
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
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 22,
                      backgroundColor: "#1A4D96",
                      borderRadius: 2,
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#1A4D96",
                      fontSize: 14,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Description
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    lineHeight: 1.9,
                    textAlign: "justify",
                    fontSize: 16,
                    color: "#5d5d5d",
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

              {/* 🟣 CLASSES SECTION */}
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 22,
                      backgroundColor: "#1A4D96",
                      borderRadius: 2,
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#1A4D96",
                      fontSize: 14,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Classes
                  </Typography>
                </Box>

                {book.book_classes?.length > 0 ? (
                  <Box
                    sx={{
                      p: 2.5,
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #E1E1E1",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                      mb: 3,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {book.book_classes.map((c, index) => (
                        <Chip
                          key={index}
                          label={c}
                          sx={{
                            backgroundColor: "#E3F2FD",
                            color: "#1565C0",
                            fontWeight: 600,
                            fontSize: 14,
                            borderRadius: "8px",
                            py: 2.5,
                            border: "1px solid #BBDEFB",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              backgroundColor: "#BBDEFB",
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
                    No classes added yet
                  </Typography>
                )}

                {/* ➕ ADD CLASS */}
                <Box
                  sx={{
                    border: "2px dashed rgba(26, 77, 150, 0.3)",
                    borderRadius: "12px",
                    p: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(26, 77, 150, 0.02)",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{ fontSize: 15, color: "#1A4D96", fontWeight: 600 }}
                    >
                      Create a new class
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#666", mt: 0.3 }}>
                      A unique class code will be generated automatically.
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "8px",
                      borderWidth: 2,
                      color: "#1A4D96",
                      borderColor: "#1A4D96",
                      fontWeight: 600,
                      textTransform: "none",
                      px: 3,
                      py: 1,
                      whiteSpace: "nowrap",
                      "&:hover": {
                        borderWidth: 2,
                        backgroundColor: "#E3F2FD",
                        borderColor: "#1A4D96",
                      },
                    }}
                    onClick={() => {
                      const generated = generateClassName(
                        book.book_classes || [],
                        book.user_book_id,
                      );
                      setClassInput(generated);
                      setOpen(true);
                    }}
                  >
                    Add Class
                  </Button>
                </Box>
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
          <DialogTitle>Set Class</DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              label="Class Name"
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
              {loadingClass ? "Saving..." : "Save"}
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}
