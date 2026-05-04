import { Box, Typography, Stack, Card, Divider } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";
import AppleCircleIcon from "src/components/icons/AppleCircleIcon";
import AndroidCircleIcon from "src/components/icons/AndroidCircleIcon";
import onlineIcon1 from "src/assets/icon/onlineIcon.png";
import GroupsIcon from "@mui/icons-material/Groups";
export default function BottomSection({ book, usedCodes }) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={2}>
      {/* AVAILABLE */}
      <Card
        sx={{
          width: { xs: "100%", md: "50%" },
          ...cardStyle,
        }}
      >
        <Typography sx={titleStyle}>Available On</Typography>

        <Typography sx={{ color: "#7a869a", fontSize: 13, mb: 2 }}>
          This book is available on the following platforms.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
          <PlatformItem
            icon={<AppleCircleIcon width={45} height={45} />}
            label="App Store"
            url={book.app_store_url}
          />

          <PlatformItem
            icon={<AndroidCircleIcon width={45} height={45} />}
            label="Google Play"
            url={book.google_play_url}
          />

          <PlatformItem
            icon={<Box component="img" src={onlineIcon1} sx={{ width: 45 }} />}
            label="Online Book"
            url={book.online_book_url}
          />
        </Stack>
      </Card>

      {/* 🔵 STATISTICS */}
      <Card
        sx={{
          width: { xs: "100%", md: "55%" },
          ...cardStyle,
        }}
      >
        <Typography sx={titleStyle}>Book Statistics</Typography>

        <Stack direction="row" alignItems="center" mt={2}>
          {/* ITEM 1 */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <StatItem
              icon={<VisibilityIcon sx={{ color: "#2B5A9E" }} />}
              value={book.views}
              label="Total Views"
            />
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* ITEM 2 */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <StatItem
              icon={<GroupIcon sx={{ color: "#9333ea" }} />}
              value={usedCodes}
              label="Active Users"
            />
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* ITEM 3 */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <StatItem
              icon={<GroupsIcon />}
              value={book.classes?.filter(Boolean).length || 0}
              label="Classes"
            />
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
}

function PlatformItem({ icon, label, url }) {
  const isAvailable = Boolean(url);

  return (
    <Box
      onClick={() => {
        if (isAvailable) window.open(url, "_blank");
      }}
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        px: 2,
        py: 1.5,
        cursor: isAvailable ? "pointer" : "",
        opacity: isAvailable ? 1 : 0.6, // 🔥 يبهت إذا مش متوفر
        transition: "0.2s",

        "&:hover": {
          backgroundColor: isAvailable ? "#f8fafc" : "transparent",
        },
      }}
    >
      {/* ICON */}
      <Box
        sx={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      {/* TEXT */}
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{label}</Typography>

        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: isAvailable ? "#22c55e" : "#9ca3af",
          }}
        >
          {isAvailable ? "Available" : "Not Available"}
        </Typography>
      </Box>
    </Box>
  );
}
function StatItem({ icon, value, label }) {
  return (
    <Stack alignItems="center" spacing={0.5}>
      {icon}

      <Typography fontWeight={600}>{value}</Typography>

      <Typography sx={{ fontSize: 12, color: "#7a869a" }}>{label}</Typography>
    </Stack>
  );
}
const cardStyle = {
  p: 3,
  borderRadius: "14px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const titleStyle = {
  fontWeight: 600,
  color: "#2B5A9E",
};
