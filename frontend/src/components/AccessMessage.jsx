import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AccessMessage({ type }) {
  const navigate = useNavigate();
const role=localStorage.getItem("role")
  const messages = {
    expired: {
      title: "Subscription Expired",
      description: "Your access to this book has expired.",
    },
    not_found: {
      title: "Book Not Found",
      description: "This book does not belong to your account.",
    },
    default: {
      title: "Something went wrong",
      description: "Please try again later.",
    },
  };

  const message = messages[type] || messages.default;

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
        {message.title}
      </Typography>

      <Typography sx={{ color: "#7a869a", mb: 4 }}>
        {message.description}
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate(`/${role}/books`)}
      >
        Back to My Books
      </Button>
    </Box>
  );
}