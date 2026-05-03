import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CodeIcon from "../../../assets/icon/Group (2).svg";
import BookIcon from "../../../assets/icon/Asset 1 5.svg";

const actions = [
  {
    id: "addBook",
    title: "Add New Book",
    color: "#E8F5E9",
    textColor: "#2E7D32",
    path: "/admin/books/create",
    icon: BookIcon,
  },
  {
    id: "generate",
    title: "Generate Code",
    color: "#F3E5F5",
    textColor: "#7B1FA2",
    icon: CodeIcon,
  },
  {
    id: "reports",
    title: "View Reports",
    color: "#FFF3E0",
    textColor: "#EF6C00",
    path: "/admin/reports",
    icon: CodeIcon, // حط icon مناسب هون بعدين
  },
];

export default function QuickActions({ onGenerateClick }) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "12px",
        p: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <Typography sx={{ fontWeight: 600, color: "#1F4E8C", mb: 2 }}>
        Quick Actions
      </Typography>

      {/* Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
        }}
      >
        {actions.map((item, index) => (
          <Box
            key={index}
            onClick={() => {
              if (item.id === "generate") {
                onGenerateClick();
              } else if (item.path) {
                navigate(item.path);
              }
            }}
            sx={{
              background: item.color,
              borderRadius: "10px",
              height: 90,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            {/* Icon (placeholder) */}
            <Typography
              sx={{
                fontSize: 22,
                color: item.textColor,
                mb: 0.5,
              }}
            >
              <img src={item.icon} style={{ width: 28, height: 28 ,color:"red" }} />
            </Typography>

            {/* Text */}
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: item.textColor,
              }}
            >
              {item.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
