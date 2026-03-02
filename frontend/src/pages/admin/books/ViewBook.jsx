import { Box, Typography, Stack, Card, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import ENDPOINTS from "../../../api/endpoints";
import ISPNIconButton from "../../../components/icons/ISPNIcon";
import PrinterIcon from "../../../components/icons/PrinterIcon";
import Icon from "../../../assets/icon/icone.svg";
import AppleCircleIcon from "../../../components/icons/AppleCircleIcon";
import AndroidCircleIcon from "../../../components/icons/AndroidCircleIcon";
import onlineIcon1 from "../../../assets/icon/onlineIcon.png";

export default function ViewBook() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);

  useEffect(() => {
    const fetchBook = async () => {
      const res = await axiosInstance.get(ENDPOINTS.BOOKS.BY_ID(id));
      setBook(res.data);
    };
    fetchBook();
  }, [id]);

  if (!book) return null;

  const isRTL = isArabic(book.title);

  return (
    <Box
      sx={{
        backgroundColor: "#f3f5f9",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* 👇 SCALE WRAPPER */}
      <Box
        sx={{
          transform: "scale(0.85)", // غير الرقم إذا بدك أصغر/أكبر
          transformOrigin: "top center",
          width: "100%",
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
          <Stack
            direction={{ xs: "column", md: isRTL ? "row" : "row-reverse" }}
            spacing={6}
            alignItems="flex-start"
          >
            {/* LEFT SIDE */}
            <Box sx={{ width: { xs: "100%", md: 520 } }}>
              <Card
                sx={{
                  borderRadius: 6,
                  overflow: "hidden",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
                  backgroundColor: "#f9fafc",
                }}
              >
                <Box
                  component="img"
                  src={book.cover_image_url_long}
                  alt={book.title}
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />

                <Box sx={{ p: 4 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontFamily: "Poppins",
                      color: "#2d5aa7",
                      fontSize: 22,
                      mb: 1,
                    }}
                  >
                    Information
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <ISPNIconButton size={20} />
                    <Typography sx={{ color: "#1A4D96" }}>
                      ISBN: {book.isbn || "—"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <PrinterIcon size={20} />
                    <Typography sx={{ color: "#1A4D96" }}>
                      {book.publisher || "Al-Rowad for Publishing & Distribution"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Box component="img" src={Icon} sx={{ width: 20, height: 20 }} />
                    <Typography sx={{ color: "#1A4D96" }}>
                      Published: {new Date(book.created_at).getFullYear()}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography sx={{ fontWeight: 600, mb: 2 }}>
                    Available on
                  </Typography>

                  <Stack direction="row" spacing={4}>
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
                        <AppleCircleIcon width={60} height={60} />
                        <Typography variant="caption" sx={{ mt: 1 }}>
                          App Store
                        </Typography>
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
                        <AndroidCircleIcon width={60} height={60} />
                        <Typography variant="caption" sx={{ mt: 1 }}>
                          Google play
                        </Typography>
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
                        <Box
                          component="img"
                          src={onlineIcon1}
                          sx={{ width: 60, height: 60, objectFit: "contain" }}
                        />
                        <Typography variant="caption" sx={{ mt: 1 }}>
                          Online book
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Card>
            </Box>

            {/* RIGHT SIDE */}
            <Box sx={{ flex: 1, textAlign: isRTL ? "right" : "left" }}>
              <Typography
                sx={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#2d5aa7",
                  mb: 3,
                }}
              >
                {book.title}
              </Typography>

              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: 15,
                  lineHeight: 2,
                  color: "#1A4D96",
                  whiteSpace: "pre-line",
                }}
              >
                {book.description}
              </Typography>
            </Box>
          </Stack>

          {/* Bottom Text */}
          <Typography
            sx={{
              textAlign: "center",
              mt: 6,
              mb: 4,
              fontFamily: "Poppins",
              fontWeight: 500,
              fontSize: 14,
              color: "#2d5aa7",
            }}
          >
            alrowadpub.com
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}