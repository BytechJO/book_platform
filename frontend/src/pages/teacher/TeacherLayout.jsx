import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import TeachBar from "../../components/layout/TeachBar";
import useSessionCheck from "../../hooks/useSessionCheck";
import { TeacherThemeProvider } from "../../contexts/TeacherThemeContext";

export default function TeacherLayout() {
  useSessionCheck();
  return (
    <TeacherThemeProvider>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
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
    </TeacherThemeProvider>
  );
}
