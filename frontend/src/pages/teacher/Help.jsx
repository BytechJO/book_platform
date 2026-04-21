import { Box,  Typography, TextField, Button } from "@mui/material";

export default function Help() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row-reverse" },
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 4,
        px: { xs: 2, md: 8 },
        pt: { md: 5 },
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* LEFT VIDEO */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "20px", md: "28px" },
            fontWeight: 700,
            mb: 2,
            textAlign: "left",
          }}
        >
          Watch how to use the platform
        </Typography>

        <Box
          sx={{
            width: "100%",
            position: "relative",
            paddingTop: "56.25%",
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="YouTube video"
            frameBorder="0"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "12px",
            }}
          />
        </Box>
      </Box>
      {/* RIGHT FORM */}
      <Box
        sx={{
          flex: 1.2,
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "20px", md: "28px" },
            fontWeight: 700,
            mb: 2,
          }}
        >
          Fill out the form and we’ll contact you soon
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField label="Full Name" fullWidth />
          <TextField label="Mobile" fullWidth />
          <TextField label="E-mail" fullWidth />
          <TextField label="Message" multiline rows={5} fullWidth />

          <Button
            variant="contained"
            sx={{
              mb: { xs: 3, md: 3 },
              width: 180,
              height: 48,
              alignSelf: "center",
              borderRadius: "14px",
              backgroundColor: "#9e9e9e",
              textTransform: "none",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
