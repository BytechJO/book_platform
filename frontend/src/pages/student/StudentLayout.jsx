import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import TeachBar from "../../components/layout/TeachBar";
import useSessionCheck from "../../hooks/useSessionCheck";
import { StudentThemeProvider } from "../../contexts/StudentThemeContext";

export default function StudentLayout() {
    useSessionCheck();
  
  return (
    <StudentThemeProvider>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          transition: "background-color 0.25s ease, color 0.25s ease",
        }}
      >
        <TeachBar />

        <Box
          sx={{
            width: "100%",
            flex: 1,
            pt: "90px",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </StudentThemeProvider>
  );
}
