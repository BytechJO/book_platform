import { Outlet, useLocation } from "react-router-dom";
import TopBar from "../../components/layout/TopBar";
import DashBar from "../../components/layout/DashBar";
import { Box, Toolbar } from "@mui/material";

export default function AdminLayout() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/admin/dashboard");

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isDashboard ? <DashBar /> : <TopBar />}

      {!isDashboard && <Toolbar />}

      <Box
        sx={{
          width: "100%",
          flex: 1,
          p: isDashboard ? 0 : 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
