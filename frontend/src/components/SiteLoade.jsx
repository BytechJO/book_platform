import { Box } from "@mui/material";
import { keyframes } from "@mui/system";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.6; }
`;

export default function SiteLoader({ fullScreen = false }) {
  return (
    <Box
      sx={{
        position: fullScreen ? "fixed" : "relative",
        inset: fullScreen ? 0 : "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: fullScreen ? "100vh" : "200px",
        backgroundColor: fullScreen ? "#ffffffcc" : "transparent",
        backdropFilter: fullScreen ? "blur(3px)" : "none",
        zIndex: 2000,
      }}
    >
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: "#2B5A9E",
          animation: `${pulse} 1.2s infinite ease-in-out`,
        }}
      />
    </Box>
  );
}