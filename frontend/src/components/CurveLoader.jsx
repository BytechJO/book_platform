import { Box } from "@mui/material";
import cup1 from "../assets/cup1.svg";
import cup2 from "../assets/cup2.svg";

export default function CurveLoader() {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: "rgba(255,255,255,0.4)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
      }}
    >
      {/* اللودر */}
      <svg
        viewBox="0 0 600 300"
        width="220"
        style={{ transform: "translateX(20px)" }}
      >
        <image href={cup1} x="40" y="120" width="70" />
        <image href={cup2} x="380" y="120" width="70" />

        <path
          pathLength={1}
          d="M110 160 C170 130, 190 130, 250 160 C290 210, 270 260, 220 250 C170 240, 180 180, 240 160 C300 140, 340 60, 290 40 C240 20, 200 80, 260 140 C320 200, 360 190, 390 170"
          style={{
            fill: "none",
            stroke: "#1f3c88",
            strokeWidth: 3,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: "0 1",
            animation: "draw 3s ease-in-out infinite",
          }}
        />

        <style>
          {`
        @keyframes draw {
          0% { stroke-dasharray: 0 1; opacity: 1; }
          80% { stroke-dasharray: 1 0; opacity: 1; }
          100% { stroke-dasharray: 1 0; opacity: 0; }
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #1f3c88;
          border-radius: 50%;
          opacity: 0.3;
          animation: blink 2s infinite;
        }

        .dot:nth-of-type(2) { animation-delay: 0.2s; }
        .dot:nth-of-type(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          40% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}
        </style>
      </svg>

      {/* النقاط */}
      <Box mt={2} display="flex" gap="15px">
        <Box className="dot" />
        <Box className="dot" />
        <Box className="dot" />
      </Box>
    </Box>
  );
}
