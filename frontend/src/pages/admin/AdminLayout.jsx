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
          px: isDashboard ? 0 : 4, // يمين + يسار
          pt: isDashboard ? 0 : 4, // فوق
          pb: 0, // 🔥 تحت = صفر
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
