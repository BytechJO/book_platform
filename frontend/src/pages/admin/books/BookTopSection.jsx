import { Box, Typography, Stack, Card, Chip, Divider } from "@mui/material";
import ISPNIconButton from "src/components/icons/ISPNIcon";
import calendarIcon from "../../../assets/icon/calendar-icon.svg";
import building from "../../../assets/icon/building.svg";
import user from "../../../assets/icon/user.svg";
import update from "../../../assets/icon/update.svg";
import folder from "../../../assets/icon/folder.svg";
import world from "../../../assets/icon/world.svg";

export default function BookTopSection({ book }) {
  if (!book) return null;
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
      {/* LEFT CARD */}
      <Card
        sx={{
          width: { xs: "100%", md: "50%" },
          p: 3,
          borderRadius: "14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Stack direction="row" spacing={3}>
          {/* Image */}
          <Box
            component="img"
            src={book.cover_image_url_short}
            sx={{
              width: 180,
              height: 250,
              borderRadius: "15px",
              objectFit: "contain",
            }}
          />

          {/* Info */}
          <Box flex={1}>
            {/* Status */}
            <Chip
              label={book.status}
              size="small"
              sx={{
                height: 28,
                borderRadius: "999px",
                px: 1.2,
                fontWeight: 600,
                fontSize: 13,

                backgroundColor: "#eef4ff", // 🔵 نفس الصورة
                color: "#2B5A9E",

                // 🔥 النقطة الخضرا
                "&::before": {
                  content: '""',
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  marginRight: "8px",
                  backgroundColor:
                    book.status === "Published" ? "#22c55e" : "#94a3b8",
                },
              }}
            />

            {/* Title */}
            <Typography fontSize={24} fontWeight={700} mb={1} mt={2}>
              {book.title}
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                color: "#6b7280",
                fontSize: 14,
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              {book.short_description}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* Author */}
            <Box sx={{ mt: 2 }}>
              {/* Author */}
              <InfoLine
                label="Author"
                value={book.created_by_name}
                type="text"
                icon={user}
              />

              {/* Category */}
              <InfoLine
                label="Category"
                value={book.category_name}
                type="chip"
                icon={folder}
              />

              {/* Language */}
              <InfoLine
                label="Language"
                value={book.language}
                type="chip"
                icon={world}
              />
            </Box>
          </Box>
        </Stack>
      </Card>

      {/* 🔵 RIGHT CARD */}
      <Card
        sx={{
          width: { xs: "100%", md: "55%" },
          p: 3,
          borderRadius: "14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            mb: 2,
            color: "#2B5A9E",
          }}
        >
          Book Information
        </Typography>

        <Stack divider={<Divider />}>
          <InfoRow
            label="ISBN"
            value={book.isbn}
            icon={<ISPNIconButton size={18} />}
          />

          <InfoRow
            label="Publisher"
            value="Al-Rowad for Publishing & Distribution"
            icon={building}
          />

          <InfoRow
            label="Published On"
            value={formatDate(book.published_at)}
            icon={calendarIcon}
          />

          <InfoRow
            label="Created By"
            value={book.created_by_name}
            icon={user}
          />

          <InfoRow
            label="Created On"
            value={formatDateTime(book.created_at)}
            icon={calendarIcon}
          />

          <InfoRow
            label="Last Updated"
            value={formatDateTime(book.updated_at)}
            icon={update}
          />
        </Stack>
      </Card>
    </Stack>
  );
}

/* ---------- helper ---------- */

function InfoRow({ label, value, icon }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1.5 }}>
      {/* LEFT (label + icon) */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ width: 280 }} // 🔥 هذا السر
      >
        {typeof icon === "string" ? (
          <Box
            component="img"
            src={icon}
            sx={{ width: 18, height: 18, opacity: 0.7 }}
          />
        ) : (
          icon
        )}

        <Typography sx={{ color: "#7a869a", fontSize: 14 }}>{label}</Typography>
      </Stack>

      {/* RIGHT (value) */}
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 500,
          color: "#2c2c2c",
        }}
      >
        {value || "-"}
      </Typography>
    </Stack>
  );
}
function InfoLine({ label, value, type = "text", icon }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
      {/* LEFT (label + icon) */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ width: 120 }} // 🔥 أهم سطر
      >
        <Typography sx={{ color: "#7a869a", fontSize: 14 }}>{label}</Typography>
      </Stack>

      <Box
        component="img"
        src={icon}
        sx={{
          width: 18,
          height: 18,
          opacity: 0.7,
          marginRight: 2,
        }}
      />
      {/* RIGHT */}
      {type === "chip" ? (
        <Chip
          label={value || "N/A"}
          size="small"
          sx={{
            backgroundColor: "#eef4ff",
            color: "#2B5A9E",
            fontWeight: 500,
            borderRadius: "8px",
          }}
        />
      ) : (
        <Typography
          sx={{
            fontSize: 14,
            color: "#2B5A9E",
            fontWeight: 500,
          }}
        >
          {value || "-"}
        </Typography>
      )}
    </Stack>
  );
}
