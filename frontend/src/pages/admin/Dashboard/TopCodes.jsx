import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function TopCodes({ codes }) {
  const navigate = useNavigate();

  const latestCodes = codes
    ?.slice()
    ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    ?.slice(0, 6);

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "12px",
        p: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // 🔥 يمنع أي عنصر يطلع برا
      }}
    >
      {/* Header */}
      <Typography sx={{ fontWeight: 600, color: "#1F4E8C", mb: 2 }}>
        Last Codes
      </Typography>

      {/* Table Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden", // أو auto إذا بدك scroll
        }}
      >
        {/* Table Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "40px 150px 150px",
            fontSize: 12,
            fontWeight: 600,
            color: "#3B6DB5",
            mb: 1.5,
            background: "#F5F7FA",
            px: 2,
            py: 1,
            borderRadius: "8px",
          }}
        >
          <span>#</span>
          <span>Code</span>
          <span>Generated On</span>
        </Box>

        {/* Rows */}
        {latestCodes.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "40px 150px 150px",
              alignItems: "center",
              py: 1,
              marginLeft: 2,
              fontSize: 13,
            }}
          >
            <span>{index + 1}</span>

            <span
              style={{
                fontWeight: 400,
                whiteSpace: "nowrap",
              }}
            >
              {item.code}
            </span>

            <span style={{ whiteSpace: "nowrap" }}>
              {new Date(item.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0.5,
          pt: 2,
          borderTop: "1px solid #eee",
          mt: "auto",
        }}
      >
        <Typography
          onClick={() => navigate("/admin/codes")}
          sx={{
            fontSize: 12,
            color: "#3f51b5",
            fontWeight: 500,
            cursor: "pointer",

            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          View all codes
        </Typography>

        <ArrowForwardIosIcon
          sx={{
            fontSize: 12,
            color: "#3f51b5",
            ml: 0.5,
          }}
        />
      </Box>
    </Box>
  );
}
