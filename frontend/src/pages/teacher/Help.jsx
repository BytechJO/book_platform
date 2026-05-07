import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SendIcon from "@mui/icons-material/Send";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

export default function Help() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendEmail = async () => {
    try {
      await emailjs.send(
        "developer3",
        "template_7zy1ux7",
        {
          fullName: formData.fullName,
          mobile: formData.mobile,
          email: formData.email,
          message: formData.message,
        },
        "r1lFJUGHCFNblzlAs",
      );

      alert("Message sent successfully!");

      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to send message");
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        px: { xs: 1.5, md: 2 },
        py: 2,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1280px",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        {/* FORM */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: "18px",
            p: { xs: 2, md: 1.5 },
            background: "#fff",
            border: "1px solid #f7f8fa",
            display: "flex",
            boxShadow: "0 4px 12px rgba(17, 24, 39, 0.08)",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* TITLE */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Box
              sx={{
                width: 55,
                height: 55,
                borderRadius: "50px",
                background: "#edf4ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MailOutlineIcon sx={{ color: "#1c459e", fontSize: 30 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "20px", md: "24px" },
                  fontWeight: 800,
                  color: "#111827",
                  lineHeight: 1.2,
                }}
              >
                Fill out the form
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: "13px",
                  color: "#8a94a6",
                  fontWeight: 500,
                }}
              >
                and we’ll contact you soon
              </Typography>
            </Box>
          </Box>

          {/* FORM */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {/* FULL NAME */}
            <Box>
              <Typography sx={labelStyle}>Full Name</Typography>

              <TextField
                fullWidth
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon
                        sx={{ color: "#9ca3af", fontSize: 18 }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={inputStyle}
              />
            </Box>

            {/* MOBILE */}
            <Box>
              <Typography sx={labelStyle}>Mobile</Typography>

              <TextField
                fullWidth
                placeholder="Enter your mobile number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon
                        sx={{ color: "#9ca3af", fontSize: 18 }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={inputStyle}
              />
            </Box>

            {/* EMAIL */}
            <Box>
              <Typography sx={labelStyle}>E-mail</Typography>

              <TextField
                fullWidth
                placeholder="Enter your e-mail address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon
                        sx={{ color: "#9ca3af", fontSize: 18 }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={inputStyle}
              />
            </Box>

            {/* MESSAGE */}
            <Box>
              <Typography sx={labelStyle}>Message</Typography>

              <TextField
                fullWidth
                multiline
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={2}
                placeholder="Type your message here..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ alignSelf: "flex-start", mt: 1 }}
                    >
                      <ChatBubbleOutlineOutlinedIcon
                        sx={{ color: "#9ca3af", fontSize: 18 }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={inputStyle}
              />
            </Box>

            {/* BUTTON */}
            <Button
              variant="contained"
              onClick={sendEmail}
              endIcon={<SendIcon sx={{ fontSize: 16 }} />}
              sx={{
                mt: 1,
                height: 44,
                borderRadius: "12px",
                background: "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 700,
                boxShadow: "none",

                "&:hover": {
                  background:
                    "linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%)",
                  boxShadow: "none",
                },
              }}
            >
              Send
            </Button>
            {/* FOOTER */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <ShieldOutlinedIcon
                sx={{
                  fontSize: 16,
                  color: "#9ca3af",
                }}
              />

              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#6b7280",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                We respect your privacy. Your information is safe with us.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* VIDEO */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: "18px",
            p: { xs: 2, md: 3 },
            background: "#fff",
            border: "1px solid #f7f8fa",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 12px rgba(17, 24, 39, 0.08)",
            justifyContent: "space-between",
          }}
        >
          {/* TITLE */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Box
              sx={{
                width: 55,
                height: 55,
                borderRadius: "50px",
                background: "#edf4ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlayCircleOutlineOutlinedIcon
                sx={{ color: "#1c459e", fontSize: 30 }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "20px", md: "24px" },
                  fontWeight: 800,
                  color: "#111827",
                  lineHeight: 1.2,
                }}
              >
                Watch how to use the platform
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: "13px",
                  color: "#8a94a6",
                  fontWeight: 500,
                }}
              >
                A quick video guide to help you get started
              </Typography>
            </Box>
          </Box>

          {/* VIDEO */}
          <Box
            sx={{
              mt: 3,
              width: "100%",
              height: "320px", // تحكم بالطول هون
              borderRadius: "14px",
              overflow: "hidden",
              background: "#0f172a",
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="YouTube video"
              frameBorder="0"
              allowFullScreen
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </Box>
          {/* INFO BOX */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              borderRadius: "12px",
              background: "#f3f6fc",
            }}
          >
            <InfoOutlinedIcon sx={{ color: "#2563eb", fontSize: 18 }} />

            <Typography
              sx={{
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              Learn how to explore books, activate codes,
              <br />
              and make the most of the platform.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

/* LABEL STYLE */
const labelStyle = {
  mb: 0.7,
  fontSize: "13px",
  fontWeight: 700,
  color: "#374151",
};

/* INPUT STYLE */
const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: "#fff",

    "& fieldset": {
      borderColor: "#e5e7eb",
    },

    "&:hover fieldset": {
      borderColor: "#2563eb",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#2563eb",
      borderWidth: "1px",
    },
  },

  /* فقط للحقول العادية */
  "& .MuiInputBase-input": {
    py: 1,
    fontSize: "13px",
  },

  /* للحقول العادية فقط */
  "& .MuiOutlinedInput-root:not(.MuiInputBase-multiline)": {
    height: "44px",
  },

  /* للـ textarea */
  "& .MuiInputBase-inputMultiline": {
    fontSize: "13px",
    lineHeight: 1.5,
  },
};
