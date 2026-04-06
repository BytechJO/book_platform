import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import Img from "../../assets/Shape Mask 13.svg";

export default function Contact() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
        py: 12,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Grid container spacing={6} sx={{ width: "120%", alignItems: "center" ,justifyContent:"center" }}>
        {/* LEFT IMAGE */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={Img}
            alt="contact"
            sx={{height:{xs:300,md:350} }}
          />
        </Grid>

        {/* RIGHT FORM */}
        <Grid item xs={12} md={6}>
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 700,
              mb: 4,
              color: "#2a2a2a",
            }}
          >
            Fill out the form and we’ll contact you soon
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Full Name"
              placeholder="Full name"
              fullWidth
              size="small"
            />

            <TextField
              label="Mobile"
              placeholder="+962"
              fullWidth
              size="small"
            />

            <TextField
              label="E-mail"
              placeholder="example@gmail.com"
              fullWidth
              size="small"
            />

            <TextField label="Message" multiline rows={4} fullWidth />

            <Button
              variant="contained"
              sx={{
                mt: 2,
                width: 160,
                alignSelf: "center",
                borderRadius: "12px",
                backgroundColor: "#9e9e9e",
                textTransform: "none",
                fontSize: "16px",
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
