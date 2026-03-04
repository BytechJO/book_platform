import { Box, Typography, Stack, Card, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import ISPNIconButton from "src/components/icons/ISPNIcon";
import PrinterIcon from "src/components/icons/PrinterIcon";
import Icon from "src/assets/icon/icone.svg";
import AppleCircleIcon from "src/components/icons/AppleCircleIcon";
import AndroidCircleIcon from "src/components/icons/AndroidCircleIcon";
import onlineIcon1 from "src/assets/icon/onlineIcon.png";
import { useGetMyOneBook } from "src/api/user_books";
import { Helmet } from "react-helmet-async";
import SiteLoader from "src/components/SiteLoade";
import AccessMessage from "src/components/AccessMessage";

export default function ViewTeacherBook() {
  const { id } = useParams();

  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);
  const { book, loading, error } = useGetMyOneBook(id);
  console.log("error", error);

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
        <title>Book details - Teacher Dashboard</title>
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
            <Box sx={{ flex: 1, textAlign: isRTL ? "right" : "left", pt: 10 }}>
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

              <Box sx={{ width: "100%" }}>
                <Typography
                  sx={{
                    width: "100%",
                    maxWidth: "100%",
                    fontFamily: "Poppins",
                    fontSize: 15,
                    lineHeight: 2,
                    color: "#1A4D96",
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    minHeight: "150px",
                  }}
                >
                  {book.description?.trim() || "\u00A0"}
                </Typography>
              </Box>
            </Box>
          </Stack>

          {/* Bottom Text */}
          <Typography
            sx={{
              textAlign: "center",
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
    </>
  );
}
