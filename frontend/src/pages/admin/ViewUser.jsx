import { useParams } from "react-router-dom";
import { useGetUser } from "../../api";
import CurveLoader from "../../components/CurveLoader";
import {
  Box,
  Typography,
  Card,
  Stack,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";

export default function ViewUser() {
  const { id } = useParams();

  const { user, books, used_codes, classes, loading } = useGetUser(id);

  if (loading) return <CurveLoader />;

  if (!user) return <div>User not found</div>;

  return (
    // خلفية الصفحة رمادي فاتح عشان الكروت تبان واضحة
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      
      {/* 🔵 HEADER */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "center", sm: "flex-start" }}>
          {/* إطار خفيف حول الأفاتار */}
          <Box sx={{ p: 0.5, borderRadius: "50%", bgcolor: "primary.light", display: "inline-flex" }}>
            <Avatar 
              src={user.avatar_url} 
              sx={{ width: 64, height: 64, bgcolor: "white", color: "primary.main", fontWeight: 700 }}
            >
              {user.full_name?.charAt(0)}
            </Avatar>
          </Box>

          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {user.full_name}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              {user.email}
            </Typography>

            <Stack direction="row" spacing={1} mt={1.5} justifyContent={{ xs: "center", sm: "flex-start" }}>
              <Chip 
                label={user.role} 
                size="small" 
                variant="outlined" 
                sx={{ fontWeight: 500 }}
              />
              <Chip
                label={user.status === "active" ? "Active" : "Inactive"}
                size="small"
                color={user.status === "active" ? "success" : "default"}
                sx={{ fontWeight: 500 }}
              />
            </Stack>
          </Box>
        </Stack>
      </Card>

      {/* 🔵 STATS */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={2}>
          User Statistics
        </Typography>

        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />}
          spacing={{ xs: 2, sm: 0 }}
          justifyContent="space-around"
        >
          <StatItem value={books?.length || 0} label="Books" />
          <StatItem value={used_codes || 0} label="Used Codes" />
          <StatItem value={classes?.length || 0} label="Classes" />
        </Stack>
      </Card>

      {/* 🔵 BOOKS */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={2}>
          Activated Books
        </Typography>

        {books?.length ? (
          <Stack spacing={1.5}>
            {books.map((b) => (
              <Stack
                key={b.id}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "#eee",
                  borderRadius: 2,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "primary.light",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    transform: "translateY(-1px)"
                  }
                }}
              >
                <Box
                  component="img"
                  src={b.cover_image_url_short}
                  sx={{
                    width: 45,
                    height: 65,
                    objectFit: "cover",
                    borderRadius: 1,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                />

                <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.3 }}>
                  {b.title}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
            No books available
          </Typography>
        )}
      </Card>

      {/* 🔵 CLASSES */}
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={2}>
          Classes
        </Typography>

        {classes?.length ? (
          // عرض الكلاسات كـ Tags أنيق ومريح
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {classes.map((c, i) => (
              <Chip 
                key={i}
                label={c.class_name || c.student_class}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
            No classes assigned
          </Typography>
        )}
      </Card>
    </Box>
  );
}

function StatItem({ value, label }) {
  return (
    <Box textAlign="center" sx={{ flex: 1, py: 1 }}>
      <Typography variant="h4" fontWeight={700} color="primary.main">
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  );
}