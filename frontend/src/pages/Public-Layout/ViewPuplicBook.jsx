import { Box, Typography, Stack, Card, Divider, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ISPNIconButton from "src/components/icons/ISPNIcon";
import PrinterIcon from "src/components/icons/PrinterIcon";
import Icon from "src/assets/icon/icone.svg";
import { useGetOnePuplicBook } from "src/api";

export default function ViewPuplicBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);
  const { book, error } = useGetOnePuplicBook(id);
  if (error) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          maxWidth: 500,
          mx: "auto",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Book Not Found
        </Typography>

        <Typography sx={{ color: "#7a869a", mb: 4 }}>
          This book does not belong to your account.
        </Typography>

        <Button variant="contained" onClick={() => navigate(`/`)}>
          Back to Home
        </Button>
      </Box>
    );
  }
  if (!book) return null;

  const isRTL = isArabic(book.title);
  return (
    <>
      <Divider
        sx={{
          width: "100%",
          borderColor: "#1A4D965C",
          mb: 2,
        }}
      />
      <Box
        sx={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, pt: 4 }}>
              <Stack
                direction={{ xs: "column", md: isRTL ? "row" : "row-reverse" }}
                spacing={6}
                alignItems="flex-start"
              >
                {/* LEFT SIDE */}
                <Box
                  sx={{
                    width: { xs: "100%", md: 420 },
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
                      borderRadius: "20px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 12px rgba(0,0,0,0.06)",
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
                        {book.publisher ||
                          "Al-Rowad for Publishing & Distribution"}
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
                  </Box>
                </Box>

                {/* RIGHT SIDE */}
                <Box sx={{ flex: 1, textAlign: isRTL ? "right" : "left" }}>
                  <Typography
                    sx={{
                      fontSize: 32,
                      fontWeight: 600,
                      color: "#2d5aa7",
                      mb: 3,
                      fontFamily: isArabic(book.title)
                        ? "Tajawal, sans-serif"
                        : "Inter, sans-serif",
                    }}
                  >
                    {book.title}
                  </Typography>

                  <Box sx={{ width: "100%" }}>
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontFamily: isArabic(book.description)
                          ? "Tajawal, sans-serif"
                          : "Inter, sans-serif",
                        fontSize: 16,
                        lineHeight: 2,
                        color: "#5d5d5d",
                        direction: isArabic(book.description) ? "rtl" : "ltr",
                        textAlign: isArabic(book.description)
                          ? "right"
                          : "left",
                      }}
                    >
                      {book.description?.trim() || "\u00A0"}
                    </Typography>
                    {book.youtube_url && (
                      <Box sx={{ mt: 3 }}>
                        <Box
                          component="iframe"
                          src={book.youtube_url.replace("watch?v=", "embed/")}
                          title="YouTube video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          sx={{
                            width: { xs: "100%", md: "70%" },
                            height: 220,
                            border: 0,
                            borderRadius: "16px",
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Stack>

              {/* Bottom Text */}
            </Box>
          </Box>
        </Box>
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: 500,
            fontSize: 14,
            color: "#2d5aa7",
            mt: 3,
            pb: 0,
          }}
        >
          alrowadpub.com
        </Typography>
      </Box>
    </>
  );
}
