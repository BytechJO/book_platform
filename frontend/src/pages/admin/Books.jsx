import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useMemo } from "react";
import { useGetBooks } from "../../api";
import EditIconButton from "../../components/icons/EditIconButton";
import DeleteIconButton from "../../components/icons/DeleteIconButton";
import { Helmet } from "react-helmet-async";

export default function Books() {
  const { books = [] } = useGetBooks();
  const [search, setSearch] = useState("");

  const filteredBooks = useMemo(() => {
    if (!search) return books;
    return books.filter((b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [books, search]);

  return (
    <Box sx={{ py: 3 }}>
      <Helmet>
        <title>Books - Admin Dashboard</title>
      </Helmet>
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: { xs: 2, md: 2 },
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontFamily: "IBM Plex Sans Thai Looped",
            fontSize: "40px",
            fontWeight: 400,
            color: "#2d5aa7",
            mb: 3,
          }}
        >
          All Books
        </Typography>

        {/* Search */}
        <Box sx={{ maxWidth: 350, mb: 4 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search in your courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Grid */}
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 10,
          }}
        >
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              sx={{
                borderRadius: 3,
                overflow: "hidden", 
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)", 
                transition: "0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardMedia
                component="img"
                image={book.cover_image_url || "/placeholder-book.png"}
                alt={book.title}
                sx={{
                  width: "100%",
                  aspectRatio: "3 / 4", 
                  objectFit: "cover", 
                  display: "block",
                }}
              />
              <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    fontWeight={400}
                    fontSize={26}
                    fontFamily="IBM Plex Sans Thai Looped"
                    color="#535353"
                  >
                    {book.title}
                  </Typography>

                  <Chip
                    label="WEB"
                    size="small"
                    sx={{
                      backgroundColor: "#2B5A9E73",
                      color: "#2B5A9E",
                      fontWeight: 400,
                      borderRadius: "3px",
                    }}
                  />
                </Stack>

                <Typography variant="body2" sx={{ mt: 1, color: "#7a869a" }}>
                  {book.description
                    ? book.description.slice(0, 30) +
                      (book.description.length > 30 ? "..." : "")
                    : "No description available."}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#2B5A9E",
                      "&:hover": { backgroundColor: "#244a86" },
                    }}
                  >
                    Manage Code
                  </Button>

                  <IconButton
                    sx={{
                      p: 0, 
                      width: 32,
                      height: 31,
                    }}
                  >
                    <EditIconButton size={32} />
                  </IconButton>

                  <IconButton
                    sx={{
                      p: 0,
                      width: 32,
                      height: 31,
                    }}
                  >
                    <DeleteIconButton size={32} />
                  </IconButton>
                </Stack>

                <Typography variant="caption" sx={{ mt: 1, color: "#7a869a" }}>
                  Codes: {book.codes_count || 0} used
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
