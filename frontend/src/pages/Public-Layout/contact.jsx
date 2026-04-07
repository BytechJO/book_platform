import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import Img from "../../assets/Shape Mask 13.svg";

export default function Contact() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 8 },
        pt: { xs: 6, md: 8 },
        pb: 0,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Grid
        container
        spacing={8}
        sx={{
          width: "100%",
          alignItems: "center",
        }}
      >
        {/* LEFT IMAGE */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={Img}
            alt="contact"
            sx={{
              width: "100%",
              height: { xs: 300, md: 450 },
              objectFit: "cover",
            }}
          />
        </Grid>

        {/* RIGHT FORM */}
        <Grid item xs={12} md={6}>
          <Typography
            sx={{
              fontSize: { xs: "20px", md: "28px" },
              fontWeight: 700,
              mb: 5,
              color: "#2a2a2a",
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
            <TextField
              label="Full Name"
              placeholder="Full name"
              fullWidth
              size="medium"
            />

            <TextField
              label="Mobile"
              placeholder="+962"
              fullWidth
              size="medium"
            />

            <TextField
              label="E-mail"
              placeholder="example@gmail.com"
              fullWidth
              size="medium"
            />

            <TextField label="Message" multiline rows={5} fullWidth />

            <Button
              variant="contained"
              sx={{
                mt: 3,
                width: 180,
                height: 48,
                alignSelf: "center",
                borderRadius: "14px",
                backgroundColor: "#9e9e9e",
                textTransform: "none",
                fontSize: "18px",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#7e7e7e",
                },
              }}
            >
              Send
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
