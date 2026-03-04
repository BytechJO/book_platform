import { Box, Typography, Stack, Card, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import ISPNIconButton from "src/components/icons/ISPNIcon";
import PrinterIcon from "src/components/icons/PrinterIcon";
import Icon from "src/assets/icon/icone.svg";
import { useGetOnePuplicBook } from "src/api";

export default function ViewPuplicBook() {
  const { id } = useParams();

  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);
  const { book } = useGetOnePuplicBook(id);
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
              mt:3
            }}
          >
            alrowadpub.com
          </Typography>
        </Box>
      </Box>
    </>
  );
}
