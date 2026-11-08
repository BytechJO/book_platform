import { Outlet, useLocation } from "react-router-dom";
import TopBar from "../../components/layout/TopBar";
import DashBar from "../../components/layout/DashBar";
import { Box, Toolbar } from "@mui/material";
import { AdminThemeProvider } from "../../contexts/AdminThemeContext";

export default function AdminLayout() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/admin/dashboard");

  return (
    <AdminThemeProvider>
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
        {isDashboard ? <DashBar /> : <TopBar />}

        {!isDashboard && <Toolbar />}

        <Box
          sx={{
            width: "100%",
            flex: 1,
            px: isDashboard ? 0 : 4,
            pt: isDashboard ? 0 : 4,
            pb: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </AdminThemeProvider>
  );
}
